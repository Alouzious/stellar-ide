// ============================================
// StellarIDE — POST /auth/login
// Returns current user info from JWT
// ============================================

use axum::{extract::Extension, Json};
use crate::auth::middleware::AuthUser;
use crate::db::queries::users;
use crate::errors::{AppError, AppResult};
use crate::models::responses::UserResponse;
use crate::AppState;
use axum::extract::State;

pub async fn me(
    State(state): State<AppState>,
    Extension(auth_user): Extension<AuthUser>,
) -> AppResult<Json<UserResponse>> {
    let user = users::find_by_id(&state.db, auth_user.id)
        .await?
        .ok_or_else(|| AppError::NotFound("User not found".to_string()))?;

    Ok(Json(UserResponse {
        id:              user.id,
        username:        user.username,
        email:           user.email,
        avatar_url:      user.avatar_url,
        stellar_address: user.stellar_address,
        created_at:      user.created_at,
    }))
}
