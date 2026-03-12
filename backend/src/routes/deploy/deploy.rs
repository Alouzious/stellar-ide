// ============================================
// StellarIDE — POST /deploy
// Builds + deploys contract to Stellar network
// ============================================

use axum::{extract::{Extension, State}, Json};
use uuid::Uuid;
use crate::AppState;
use crate::auth::middleware::AuthUser;
use crate::artifacts::parse_deploy_output;
use crate::db::queries::{deployments, projects};
use crate::docker::runner::run_in_sandbox;
use crate::errors::{AppError, AppResult};
use crate::models::requests::DeployRequest;
use crate::models::responses::DeployResponse;

pub async fn deploy(
    State(state): State<AppState>,
    Extension(auth_user): Extension<AuthUser>,
    Json(body): Json<DeployRequest>,
) -> AppResult<Json<DeployResponse>> {
    // ── Validate project ownership ────────────
    let project_id = Uuid::parse_str(&body.project_id)
        .map_err(|_| AppError::BadRequest("Invalid project ID".to_string()))?;

    let project = projects::find_by_id(&state.db, project_id)
        .await?
        .ok_or_else(|| AppError::NotFound("Project not found".to_string()))?;

    if project.user_id != auth_user.id {
        return Err(AppError::Forbidden("Access denied".to_string()));
    }

    // ── Create pending deployment record ──────
    let deployment = deployments::create(
        &state.db,
        auth_user.id,
        project_id,
        &body.network,
    )
    .await?;

    // ── Acquire semaphore ─────────────────────
    let _permit = state.semaphore.acquire().await?;

    // ── Build WASM ────────────────────────────
    let build_result = run_in_sandbox(
        &state.config.sandbox_image,
        &body.source_code,
        &["stellar", "contract", "build", "--release"],
        state.config.sandbox_timeout_secs,
    )
    .await?;

    if build_result.exit_code != 0 {
        deployments::update_status(
            &state.db, deployment.id, "failed",
            None, None,
            Some(&build_result.stderr),
        ).await?;
        return Err(AppError::Internal(format!(
            "Build failed:\n{}", build_result.stderr
        )));
    }

    // ── Deploy to Stellar network ─────────────
    let network_arg = match body.network.as_str() {
        "mainnet" => "--network mainnet",
        _         => "--network testnet",
    };

    let deploy_result = run_in_sandbox(
        &state.config.sandbox_image,
        &body.source_code,
        &[
            "stellar", "contract", "deploy",
            "--wasm", "/workspace/target/wasm32-unknown-unknown/release/contract.wasm",
            network_arg,
        ],
        state.config.sandbox_timeout_secs,
    )
    .await?;

    if deploy_result.exit_code != 0 {
        deployments::update_status(
            &state.db, deployment.id, "failed",
            None, None,
            Some(&deploy_result.stderr),
        ).await?;
        return Err(AppError::Internal(format!(
            "Deploy failed:\n{}", deploy_result.stderr
        )));
    }

    // ── Parse contract ID ─────────────────────
    let parsed = parse_deploy_output(&deploy_result.stdout)?;

    // ── Update deployment record ──────────────
    let updated = deployments::update_status(
        &state.db,
        deployment.id,
        "success",
        Some(&parsed.contract_id),
        parsed.tx_hash.as_deref(),
        None,
    )
    .await?
    .ok_or_else(|| AppError::Internal("Deployment record missing".to_string()))?;

    Ok(Json(DeployResponse {
        deployment_id: updated.id,
        contract_id:   updated.contract_id,
        network:       updated.network,
        status:        updated.status,
        tx_hash:       updated.tx_hash,
        deployed_at:   updated.deployed_at,
    }))
}
