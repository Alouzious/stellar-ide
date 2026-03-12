// ============================================
// StellarIDE — Axum Auth Middleware
// Extracts + validates JWT from Authorization header
// ============================================

use axum::{
    extract::{Request, State},
    middleware::Next,
    response::Response,
};
use uuid::Uuid;
use crate::auth::jwt::verify_token;
use crate::errors::AppError;
use crate::AppState;

#[derive(Debug, Clone)]
pub struct AuthUser {
    pub id: Uuid,
    pub username: String,
}

pub async fn require_auth(
    State(state): State<AppState>,
    mut request: Request,
    next: Next,
) -> Result<Response, AppError> {
    // ── Extract Bearer token ──────────────────
    let token = request
        .headers()
        .get("Authorization")
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.strip_prefix("Bearer "))
        .ok_or_else(|| AppError::Unauthorized("Missing Authorization header".to_string()))?;

    // ── Verify JWT ────────────────────────────
    let claims = verify_token(token, &state.config.jwt_secret)?;

    // ── Parse user ID ─────────────────────────
    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| AppError::Unauthorized("Invalid user ID in token".to_string()))?;

    // ── Inject AuthUser into request ──────────
    request.extensions_mut().insert(AuthUser {
        id: user_id,
        username: claims.username,
    });

    Ok(next.run(request).await)
}
