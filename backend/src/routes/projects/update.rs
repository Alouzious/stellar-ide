// ============================================
// StellarIDE — PUT /projects/:id
// ============================================

use axum::{
    extract::{Extension, Path, State},
    Json,
};
use uuid::Uuid;
use crate::auth::middleware::AuthUser;
use crate::db::models::project::UpdateProject;
use crate::db::queries::projects;
use crate::errors::{AppError, AppResult};
use crate::models::requests::UpdateProjectRequest;
use crate::models::responses::ProjectResponse;
use crate::AppState;

pub async fn update_project(
    State(state): State<AppState>,
    Extension(auth_user): Extension<AuthUser>,
    Path(id): Path<Uuid>,
    Json(body): Json<UpdateProjectRequest>,
) -> AppResult<Json<ProjectResponse>> {
    let project = projects::update(
        &state.db,
        id,
        auth_user.id,
        &UpdateProject {
            name:        body.name,
            description: body.description,
            source_code: body.source_code,
            is_public:   body.is_public,
        },
    )
    .await?
    .ok_or_else(|| AppError::NotFound("Project not found or access denied".to_string()))?;

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
