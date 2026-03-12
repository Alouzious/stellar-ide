// ============================================
// StellarIDE — API Request Structs
// ============================================

use serde::{Deserialize, Serialize};

// ── Auth ──────────────────────────────────────
#[derive(Debug, Deserialize)]
pub struct GitHubCallbackRequest {
    pub code: String,
    pub state: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct RefreshTokenRequest {
    pub refresh_token: String,
}

// ── Projects ──────────────────────────────────
#[derive(Debug, Deserialize, Serialize)]
pub struct CreateProjectRequest {
    pub name: String,
    pub description: Option<String>,
    pub source_code: String,
    pub language: String,
    pub is_public: Option<bool>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct UpdateProjectRequest {
    pub name: Option<String>,
    pub description: Option<String>,
    pub source_code: Option<String>,
    pub is_public: Option<bool>,
}

// ── Sandbox ───────────────────────────────────
#[derive(Debug, Deserialize, Serialize)]
pub struct SandboxRequest {
    pub source_code: String,
    pub language: String,
    pub project_id: Option<String>,
}

// ── Deploy ────────────────────────────────────
#[derive(Debug, Deserialize, Serialize)]
pub struct DeployRequest {
    pub project_id: String,
    pub network: String,
    pub source_code: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct InterfaceRequest {
    pub contract_id: String,
    pub network: String,
}

// ── Artifacts ─────────────────────────────────
#[derive(Debug, Deserialize, Serialize)]
pub struct GenerateArtifactsRequest {
    pub deployment_id: String,
    pub contract_id: String,
    pub network: String,
}

// ── Wallet ────────────────────────────────────
#[derive(Debug, Deserialize, Serialize)]
pub struct FriendbotRequest {
    pub address: String,
    pub network: Option<String>,
}
