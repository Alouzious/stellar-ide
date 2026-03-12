// ============================================
// StellarIDE — DELETE /projects/:id
// ============================================

use axum::{
    extract::{Extension, Path, State},
    Json,
};
use uuid::Uuid;
use crate::auth::middleware::AuthUser;
use crate::db::queries::projects;
use crate::errors::{AppError, AppResult};
use crate::models::responses::MessageResponse;
use crate::AppState;

pub async fn delete_project(
    State(state): State<AppState>,
    Extension(auth_user): Extension<AuthUser>,
    Path(id): Path<Uuid>,
) -> AppResult<Json<MessageResponse>> {
    let deleted = projects::delete(&state.db, id, auth_user.id).await?;

    if !deleted {
        return Err(AppError::NotFound("Project not found or access denied".to_string()));
    }

    Ok(Json(MessageResponse {
        message: "Project deleted successfully".to_string(),
    }))
}
