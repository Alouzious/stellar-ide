// ============================================
// StellarIDE — GET /wallet/friendbot
// Funds a testnet address via Friendbot
// ============================================

use axum::{extract::State, Json};
use axum::extract::Query;
use reqwest::Client;
use crate::errors::{AppError, AppResult};
use crate::models::requests::FriendbotRequest;
use crate::AppState;

pub async fn friendbot(
    State(_state): State<AppState>,
    Query(params): Query<FriendbotRequest>,
) -> AppResult<Json<serde_json::Value>> {
    let network = params.network.as_deref().unwrap_or("testnet");

    let friendbot_url = match network {
        "testnet" => format!(
            "https://friendbot.stellar.org?addr={}",
            params.address
        ),
        "futurenet" => format!(
            "https://friendbot-futurenet.stellar.org?addr={}",
            params.address
        ),
        _ => return Err(AppError::BadRequest(
            format!("Friendbot not available on network: {}", network)
        )),
    };

    let client = Client::new();
    let response = client
        .get(&friendbot_url)
        .send()
        .await?
        .json::<serde_json::Value>()
        .await
        .map_err(|e| AppError::Internal(format!("Friendbot error: {}", e)))?;

    Ok(Json(serde_json::json!({
        "success": true,
        "address": params.address,
        "network": network,
        "result":  response,
    })))
}
