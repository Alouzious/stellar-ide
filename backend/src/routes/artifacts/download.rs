// ============================================
// StellarIDE — GET /artifacts/:id/download
// Streams the ZIP file for download
// ============================================

use axum::{
    body::Body,
    extract::{Extension, Path, State},
    http::{header, Response, StatusCode},
    response::IntoResponse,
};
use uuid::Uuid;
use crate::auth::middleware::AuthUser;
use crate::db::queries::artifacts;
use crate::errors::{AppError, AppResult};
use crate::AppState;

pub async fn download(
    State(state): State<AppState>,
    Extension(auth_user): Extension<AuthUser>,
    Path(id): Path<Uuid>,
) -> AppResult<impl IntoResponse> {
    // ── Fetch artifact record ─────────────────
    let artifact = artifacts::find_by_id(&state.db, id)
        .await?
        .ok_or_else(|| AppError::NotFound("Artifact not found".to_string()))?;

    if artifact.user_id != auth_user.id {
        return Err(AppError::Forbidden("Access denied".to_string()));
    }

    // ── Read ZIP from disk ────────────────────
    let zip_path = artifact.zip_path
        .ok_or_else(|| AppError::NotFound("ZIP not found for this artifact".to_string()))?;

    let zip_bytes = tokio::fs::read(&zip_path)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to read ZIP: {}", e)))?;

    let filename = format!("contract-{}.zip", &artifact.contract_id[..8.min(artifact.contract_id.len())]);

    // ── Return as download ────────────────────
    let response = Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "application/zip")
        .header(
            header::CONTENT_DISPOSITION,
            format!("attachment; filename=\"{}\"", filename),
        )
        .body(Body::from(zip_bytes))
        .map_err(|e| AppError::Internal(e.to_string()))?;

    Ok(response)
}
