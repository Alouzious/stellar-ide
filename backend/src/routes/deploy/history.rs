// ============================================
// StellarIDE — GET /deploy/history
// ============================================

use axum::{extract::{Extension, State}, Json};
use crate::auth::middleware::AuthUser;
use crate::db::queries::deployments;
use crate::errors::AppResult;
use crate::models::responses::{DeployHistoryResponse, DeployResponse};
use crate::AppState;

pub async fn history(
    State(state): State<AppState>,
    Extension(auth_user): Extension<AuthUser>,
) -> AppResult<Json<DeployHistoryResponse>> {
    let all = deployments::list_by_user(&state.db, auth_user.id).await?;
    let total = all.len();

    let items = all
        .into_iter()
        .map(|d| DeployResponse {
            deployment_id: d.id,
            contract_id:   d.contract_id,
            network:       d.network,
            status:        d.status,
            tx_hash:       d.tx_hash,
            deployed_at:   d.deployed_at,
        })
        .collect();

    Ok(Json(DeployHistoryResponse {
        deployments: items,
        total,
    }))
}
