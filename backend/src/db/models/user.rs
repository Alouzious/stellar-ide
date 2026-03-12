// ============================================
// StellarIDE — User DB Model
// ============================================

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct User {
    pub id: Uuid,
    pub github_id: i64,
    pub username: String,
    pub email: Option<String>,
    pub avatar_url: Option<String>,
    pub stellar_address: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateUser {
    pub github_id: i64,
    pub username: String,
    pub email: Option<String>,
    pub avatar_url: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateUser {
    pub email: Option<String>,
    pub avatar_url: Option<String>,
    pub stellar_address: Option<String>,
}
