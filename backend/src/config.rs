// ============================================
// StellarIDE — Configuration
// Loads all environment variables into a
// strongly-typed Config struct
// ============================================

use anyhow::{Context, Result};

#[derive(Debug, Clone)]
pub struct Config {
    // ── Database ─────────────────────────────
    pub database_url: String,

    // ── Redis ────────────────────────────────
    pub redis_url: String,

    // ── Auth ─────────────────────────────────
    pub jwt_secret: String,
    pub jwt_expiry_hours: i64,

    // ── GitHub OAuth ─────────────────────────
    pub github_client_id: String,
    pub github_client_secret: String,
    pub github_redirect_url: String,

    // ── Sandbox ──────────────────────────────
    pub sandbox_image: String,
    pub max_sandboxes: u32,
    pub sandbox_timeout_secs: u64,

    // ── Server ───────────────────────────────
    pub port: u16,
}

impl Config {
    pub fn from_env() -> Result<Self> {
        dotenvy::dotenv().ok();

        Ok(Config {
            // ── Database ─────────────────────
            database_url: std::env::var("DATABASE_URL")
                .context("DATABASE_URL must be set")?,

            // ── Redis ────────────────────────
            redis_url: std::env::var("REDIS_URL")
                .unwrap_or_else(|_| "redis://localhost:6379".to_string()),

            // ── Auth ─────────────────────────
            jwt_secret: std::env::var("JWT_SECRET")
                .context("JWT_SECRET must be set")?,

            jwt_expiry_hours: std::env::var("JWT_EXPIRY_HOURS")
                .unwrap_or_else(|_| "24".to_string())
                .parse::<i64>()
                .context("JWT_EXPIRY_HOURS must be a number")?,

            // ── GitHub OAuth ─────────────────
            github_client_id: std::env::var("GITHUB_CLIENT_ID")
                .context("GITHUB_CLIENT_ID must be set")?,

            github_client_secret: std::env::var("GITHUB_CLIENT_SECRET")
                .context("GITHUB_CLIENT_SECRET must be set")?,

            github_redirect_url: std::env::var("GITHUB_REDIRECT_URL")
                .context("GITHUB_REDIRECT_URL must be set")?,

            // ── Sandbox ──────────────────────
            sandbox_image: std::env::var("SANDBOX_IMAGE")
                .unwrap_or_else(|_| "wasm_sandbox".to_string()),

            max_sandboxes: std::env::var("MAX_SANDBOXES")
                .unwrap_or_else(|_| "4".to_string())
                .parse::<u32>()
                .context("MAX_SANDBOXES must be a number")?,

            sandbox_timeout_secs: std::env::var("SANDBOX_TIMEOUT_SECS")
                .unwrap_or_else(|_| "120".to_string())
                .parse::<u64>()
                .context("SANDBOX_TIMEOUT_SECS must be a number")?,

            // ── Server ───────────────────────
            port: std::env::var("PORT")
                .unwrap_or_else(|_| "8080".to_string())
                .parse::<u16>()
                .context("PORT must be a number")?,
        })
    }
}
