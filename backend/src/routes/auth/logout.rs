// ============================================
// StellarIDE — POST /auth/logout
// Blacklists the JWT in Redis
// ============================================

use axum::{extract::State, Json};
use axum::http::HeaderMap;
use crate::cache::sessions::blacklist_token;
use crate::errors::{AppError, AppResult};
use crate::models::responses::MessageResponse;
use crate::AppState;

pub async fn logout(
    State(state): State<AppState>,
    headers: HeaderMap,
) -> AppResult<Json<MessageResponse>> {
    let token = headers
        .get("Authorization")
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.strip_prefix("Bearer "))
        .ok_or_else(|| AppError::Unauthorized("Missing token".to_string()))?;

    let expiry = (state.config.jwt_expiry_hours * 3600) as u64;
    let mut redis = state.redis.clone();
    blacklist_token(&mut redis, token, expiry).await?;

    Ok(Json(MessageResponse {
        message: "Logged out successfully".to_string(),
    }))
}
