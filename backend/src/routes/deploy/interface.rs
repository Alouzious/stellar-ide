// ============================================
// StellarIDE — POST /deploy/interface
// Fetches ABI for an already-deployed contract
// ============================================

use axum::{extract::State, Json};
use crate::artifacts::parse_abi_output;
use crate::docker::runner::run_in_sandbox;
use crate::errors::AppResult;
use crate::models::requests::InterfaceRequest;
use crate::AppState;

pub async fn interface(
    State(state): State<AppState>,
    Json(body): Json<InterfaceRequest>,
) -> AppResult<Json<serde_json::Value>> {
    let _permit = state.semaphore.acquire().await?;

    let network_arg = match body.network.as_str() {
        "mainnet" => "--network mainnet",
        _         => "--network testnet",
    };

    let result = run_in_sandbox(
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

    let parsed = parse_abi_output(&result.stdout)?;

    Ok(Json(serde_json::json!({
        "contract_id": body.contract_id,
        "network":     body.network,
        "abi":         parsed.abi,
    })))
}
