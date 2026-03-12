// ============================================
// StellarIDE — GET /projects
// ============================================

use axum::{extract::{Extension, State}, Json};
use crate::auth::middleware::AuthUser;
use crate::db::queries::projects;
use crate::errors::AppResult;
use crate::models::responses::{ProjectListResponse, ProjectResponse};
use crate::AppState;

pub async fn list_projects(
    State(state): State<AppState>,
    Extension(auth_user): Extension<AuthUser>,
) -> AppResult<Json<ProjectListResponse>> {
    let all = projects::list_by_user(&state.db, auth_user.id).await?;

    let total = all.len();
    let items = all
        .into_iter()
        .map(|p| ProjectResponse {
            id:          p.id,
            user_id:     p.user_id,
            name:        p.name,
            description: p.description,
            source_code: p.source_code,
            language:    p.language,
            is_public:   p.is_public,
            created_at:  p.created_at,
            updated_at:  p.updated_at,
        })
        .collect();

    Ok(Json(ProjectListResponse {
        projects: items,
        total,
    }))
}
