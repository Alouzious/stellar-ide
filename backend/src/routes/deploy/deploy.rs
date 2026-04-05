use axum::{extract::{Extension, State}, Json};
use uuid::Uuid;
use base64::{Engine as _, engine::general_purpose};
use crate::AppState;
use crate::auth::middleware::AuthUser;
use crate::db::queries::{deployments, projects};
use crate::docker::runner::run_in_sandbox_read_file;
use crate::errors::{AppError, AppResult};
use crate::models::requests::{ConfirmDeployRequest, DeployRequest};
use crate::models::responses::{DeployResponse, PrepareDeployResponse};

pub async fn deploy(
    State(state): State<AppState>,
    Extension(auth_user): Extension<AuthUser>,
    Json(body): Json<DeployRequest>,
) -> AppResult<Json<PrepareDeployResponse>> {
    let project_id = Uuid::parse_str(&body.project_id)
        .map_err(|_| AppError::BadRequest("Invalid project ID".to_string()))?;
    let project = projects::find_by_id(&state.db, project_id)
        .await?
        .ok_or_else(|| AppError::NotFound("Project not found".to_string()))?;
    if project.user_id != auth_user.id {
        return Err(AppError::Forbidden("Access denied".to_string()));
    }
    let deployment = deployments::create(
        &state.db, auth_user.id, project_id, &body.network,
    ).await?;
    let _permit = state.semaphore.acquire().await?;
    let build = run_in_sandbox_read_file(
        &state.config.sandbox_image,
        &body.source_code,
        &["stellar", "contract", "build"],
        "/mnt/cargo/target/wasm32v1-none/release/contract.wasm",
        state.config.sandbox_timeout_secs,
    ).await?;
    if build.result.exit_code != 0 {
        deployments::update_status(&state.db, deployment.id, "failed", None, None, Some(&build.result.stderr)).await?;
        return Err(AppError::Internal(format!("Build failed:\n{}", build.result.stderr)));
    }
    let wasm_bytes = build.file_bytes
        .ok_or_else(|| AppError::Internal("WASM file not found after build".to_string()))?;
    let wasm_base64 = general_purpose::STANDARD.encode(&wasm_bytes);
    Ok(Json(PrepareDeployResponse {
        deployment_id: deployment.id.to_string(),
        wasm_hash: wasm_base64,
        network: body.network,
        source_account: body.source_account,
    }))
}

pub async fn confirm(
    State(state): State<AppState>,
    Extension(auth_user): Extension<AuthUser>,
    Json(body): Json<ConfirmDeployRequest>,
) -> AppResult<Json<DeployResponse>> {
    let deployment_id = Uuid::parse_str(&body.deployment_id)
        .map_err(|_| AppError::BadRequest("Invalid deployment ID".to_string()))?;
    let updated = deployments::update_status(
        &state.db, deployment_id, "success",
        Some(&body.contract_id), body.tx_hash.as_deref(), None,
    ).await?
    .ok_or_else(|| AppError::Internal("Deployment record missing".to_string()))?;
    Ok(Json(DeployResponse {
        deployment_id: updated.id,
        contract_id: updated.contract_id,
        network: updated.network,
        status: updated.status,
        tx_hash: updated.tx_hash,
        deployed_at: updated.deployed_at,
    }))
}
