// ============================================
// StellarIDE — POST /artifacts/generate
// Generates TS client + ZIP for a deployment
// ============================================

use axum::{extract::{Extension, State}, Json};
use uuid::Uuid;
use crate::auth::middleware::AuthUser;
use crate::artifacts::{generate_ts_client, parse_abi_output, ArtifactBundle, create_zip};
use crate::db::queries::artifacts;
use crate::docker::runner::run_in_sandbox;
use crate::errors::{AppError, AppResult};
use crate::models::requests::GenerateArtifactsRequest;
use crate::models::responses::ArtifactResponse;
use crate::AppState;

pub async fn generate(
    State(state): State<AppState>,
    Extension(auth_user): Extension<AuthUser>,
    Json(body): Json<GenerateArtifactsRequest>,
) -> AppResult<Json<ArtifactResponse>> {
    let deployment_id = Uuid::parse_str(&body.deployment_id)
        .map_err(|_| AppError::BadRequest("Invalid deployment ID".to_string()))?;

    // ── Fetch ABI from network ────────────────
    let _permit = state.semaphore.acquire().await?;

    let network_arg = match body.network.as_str() {
        "mainnet" => "--network mainnet",
        _         => "--network testnet",
    };

    let abi_result = run_in_sandbox(
        &state.config.sandbox_image,
        "",
        &[
            "stellar", "contract", "info",
            "--id", &body.contract_id,
            network_arg,
            "--output", "json",
        ],
        60,
    )
    .await?;

    let parsed_abi = parse_abi_output(&abi_result.stdout)?;
    let abi_json = serde_json::to_string_pretty(&parsed_abi.abi)
        .map_err(|e| AppError::Internal(e.to_string()))?;

    // ── Generate TypeScript client ────────────
    let ts_client = generate_ts_client(
        &body.contract_id,
        &body.network,
        &parsed_abi.abi,
    )?;

    // ── Create ZIP bundle ─────────────────────
    let bundle = ArtifactBundle {
        contract_id: body.contract_id.clone(),
        abi_json:    abi_json.clone(),
        ts_client:   ts_client.clone(),
        network:     body.network.clone(),
    };
    let zip_bytes = create_zip(&bundle)?;

    // ── Save ZIP to disk ──────────────────────
    let zip_dir = std::path::Path::new("/tmp/stellaride/artifacts");
    tokio::fs::create_dir_all(zip_dir).await
        .map_err(|e| AppError::Internal(format!("Failed to create artifact dir: {}", e)))?;

    let zip_path = zip_dir.join(format!("{}.zip", deployment_id));
    tokio::fs::write(&zip_path, &zip_bytes).await
        .map_err(|e| AppError::Internal(format!("Failed to write ZIP: {}", e)))?;

    // ── Save artifact to DB ───────────────────
    let artifact = artifacts::create(
        &state.db,
        deployment_id,
        auth_user.id,
        &body.contract_id,
        parsed_abi.abi,
        parsed_abi.wasm_hash.as_deref(),
        Some(&ts_client),
        Some(zip_path.to_str().unwrap_or("")),
    )
    .await?;

    Ok(Json(ArtifactResponse {
        id:            artifact.id,
        deployment_id: artifact.deployment_id,
        contract_id:   artifact.contract_id,
        abi:           artifact.abi,
        wasm_hash:     artifact.wasm_hash,
        created_at:    artifact.created_at,
    }))
}
