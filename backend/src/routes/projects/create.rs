// ============================================
// StellarIDE — POST /projects
// ============================================

use axum::{extract::{Extension, State}, Json};
use crate::auth::middleware::AuthUser;
use crate::db::models::project::CreateProject;
use crate::db::queries::projects;
use crate::errors::AppResult;
use crate::models::requests::CreateProjectRequest;
use crate::models::responses::ProjectResponse;
use crate::AppState;

pub async fn create_project(
    State(state): State<AppState>,
    Extension(auth_user): Extension<AuthUser>,
    Json(body): Json<CreateProjectRequest>,
) -> AppResult<Json<ProjectResponse>> {
    let project = projects::create(
        &state.db,
        auth_user.id,
        &CreateProject {
            name:        body.name,
            description: body.description,
            source_code: body.source_code,
            language:    body.language,
            is_public:   body.is_public,
        },
    )
    .await?;

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
