// ============================================
// StellarIDE — GET /projects/:id
// ============================================

use axum::{
    extract::{Extension, Path, State},
    Json,
};
use uuid::Uuid;
use crate::auth::middleware::AuthUser;
use crate::db::queries::projects;
use crate::errors::{AppError, AppResult};
use crate::models::responses::ProjectResponse;
use crate::AppState;

pub async fn get_project(
    State(state): State<AppState>,
    Extension(auth_user): Extension<AuthUser>,
    Path(id): Path<Uuid>,
) -> AppResult<Json<ProjectResponse>> {
    let project = projects::find_by_id(&state.db, id)
        .await?
        .ok_or_else(|| AppError::NotFound("Project not found".to_string()))?;

    // ── Only owner can view private projects ──
    if !project.is_public && project.user_id != auth_user.id {
        return Err(AppError::Forbidden("Access denied".to_string()));
    }

    Ok(Json(ProjectResponse {
        id:          project.id,
        user_id:     project.user_id,
        name:        project.name,
        description: project.description,
        source_code: project.source_code,
        language:    project.language,
        is_public:   project.is_public,
        created_at:  project.created_at,
        updated_at:  project.updated_at,
    }))
}
