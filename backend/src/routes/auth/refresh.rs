// ============================================
// StellarIDE — POST /auth/refresh
// Issues a new JWT for a valid existing token
// ============================================

use axum::{extract::State, Json};
use axum::extract::Extension;
use crate::auth::jwt::create_token;
use crate::auth::middleware::AuthUser;
use crate::errors::AppResult;
use crate::AppState;

pub async fn refresh(
    State(state): State<AppState>,
    Extension(auth_user): Extension<AuthUser>,
) -> AppResult<Json<serde_json::Value>> {
    let token = create_token(
        auth_user.id,
        &auth_user.username,
        &state.config.jwt_secret,
        state.config.jwt_expiry_hours,
    )?;

    Ok(Json(serde_json::json!({ "token": token })))
}
