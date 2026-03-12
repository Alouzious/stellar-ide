// ============================================
// StellarIDE — API Response Structs
// ============================================

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// ── Auth ──────────────────────────────────────
#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: UserResponse,
}

// ── User ──────────────────────────────────────
#[derive(Debug, Serialize)]
pub struct UserResponse {
    pub id: Uuid,
    pub username: String,
    pub email: Option<String>,
    pub avatar_url: Option<String>,
    pub stellar_address: Option<String>,
    pub created_at: DateTime<Utc>,
}

// ── Projects ──────────────────────────────────
#[derive(Debug, Serialize)]
pub struct ProjectResponse {
    pub id: Uuid,
    pub user_id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub source_code: String,
    pub language: String,
    pub is_public: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct ProjectListResponse {
    pub projects: Vec<ProjectResponse>,
    pub total: usize,
}

// ── Sandbox ───────────────────────────────────
#[derive(Debug, Serialize, Deserialize)]
pub struct SandboxChunk {
    pub r#type: String,   // "stdout" | "stderr" | "done" | "error"
    pub data: String,
    pub exit_code: Option<i32>,
}

// ── Deploy ────────────────────────────────────
#[derive(Debug, Serialize)]
pub struct DeployResponse {
    pub deployment_id: Uuid,
    pub contract_id: Option<String>,
    pub network: String,
    pub status: String,
    pub tx_hash: Option<String>,
    pub deployed_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize)]
pub struct DeployHistoryResponse {
    pub deployments: Vec<DeployResponse>,
    pub total: usize,
}

// ── Artifacts ─────────────────────────────────
#[derive(Debug, Serialize)]
pub struct ArtifactResponse {
    pub id: Uuid,
    pub deployment_id: Uuid,
    pub contract_id: String,
    pub abi: serde_json::Value,
    pub wasm_hash: Option<String>,
    pub created_at: DateTime<Utc>,
}

// ── Health ────────────────────────────────────
#[derive(Debug, Serialize)]
pub struct HealthResponse {
    pub status: String,
    pub version: String,
    pub database: String,
    pub redis: String,
}

// ── Generic ───────────────────────────────────
#[derive(Debug, Serialize)]
pub struct MessageResponse {
    pub message: String,
}

#[derive(Debug, Serialize)]
pub struct ErrorResponse {
    pub error: String,
    pub status: u16,
}
