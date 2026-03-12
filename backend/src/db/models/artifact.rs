// ============================================
// StellarIDE — Artifact DB Model
// ============================================

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Artifact {
    pub id: Uuid,
    pub deployment_id: Uuid,
    pub user_id: Uuid,
    pub contract_id: String,
    pub abi: serde_json::Value,
    pub wasm_hash: Option<String>,
    pub ts_client: Option<String>,
    pub zip_path: Option<String>,
    pub created_at: DateTime<Utc>,
}
