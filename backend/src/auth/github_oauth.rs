// ============================================
// StellarIDE — GitHub OAuth Flow
// ============================================

use reqwest::Client;
use serde::{Deserialize, Serialize};
use crate::config::Config;
use crate::errors::{AppError, AppResult};

#[derive(Debug, Deserialize)]
pub struct GitHubTokenResponse {
    pub access_token: String,
    pub token_type: String,
    pub scope: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct GitHubUser {
    pub id: i64,
    pub login: String,
    pub email: Option<String>,
    pub avatar_url: Option<String>,
    pub name: Option<String>,
}

// ── Exchange code for access token ───────────
pub async fn exchange_code(
    code: &str,
    config: &Config,
) -> AppResult<String> {
    let client = Client::new();

    let response = client
        .post("https://github.com/login/oauth/access_token")
        .header("Accept", "application/json")
        .json(&serde_json::json!({
            "client_id":     config.github_client_id,
            "client_secret": config.github_client_secret,
            "code":          code,
            "redirect_uri":  config.github_redirect_url,
        }))
        .send()
        .await?
        .json::<GitHubTokenResponse>()
        .await
        .map_err(|e| AppError::Internal(format!("Failed to parse GitHub token: {}", e)))?;

    Ok(response.access_token)
}

// ── Fetch GitHub user profile ─────────────────
pub async fn fetch_github_user(access_token: &str) -> AppResult<GitHubUser> {
    let client = Client::new();

    let user = client
        .get("https://api.github.com/user")
        .header("Authorization", format!("Bearer {}", access_token))
        .header("User-Agent", "StellarIDE/1.0")
        .send()
        .await?
        .json::<GitHubUser>()
        .await
        .map_err(|e| AppError::Internal(format!("Failed to parse GitHub user: {}", e)))?;

    Ok(user)
}

// ── Build GitHub OAuth redirect URL ──────────
pub fn build_redirect_url(config: &Config) -> String {
    format!(
        "https://github.com/login/oauth/authorize?client_id={}&redirect_uri={}&scope=user:email",
        config.github_client_id,
        config.github_redirect_url,
    )
}
