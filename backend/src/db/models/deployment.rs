// ============================================
// StellarIDE — Deployment DB Model
// ============================================

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Deployment {
    pub id: Uuid,
    pub user_id: Uuid,
    pub project_id: Uuid,
    pub contract_id: Option<String>,
    pub network: String,
    pub status: String,
    pub tx_hash: Option<String>,
    pub error_message: Option<String>,
    pub deployed_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
}
