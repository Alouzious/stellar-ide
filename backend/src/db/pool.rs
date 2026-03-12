// ============================================
// StellarIDE — PostgreSQL Connection Pool
// SQLx async pool with health check
// ============================================

use sqlx::postgres::{PgPool, PgPoolOptions};
use std::time::Duration;
use crate::config::Config;
use crate::errors::AppError;

pub type DbPool = PgPool;

pub async fn create_pool(config: &Config) -> Result<DbPool, AppError> {
    tracing::info!("Connecting to PostgreSQL...");

    let pool = PgPoolOptions::new()
        .max_connections(20)
        .min_connections(2)
        .acquire_timeout(Duration::from_secs(10))
        .idle_timeout(Duration::from_secs(600))
        .max_lifetime(Duration::from_secs(1800))
        .connect(&config.database_url)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to connect to database: {}", e)))?;

    // ── Health check ──────────────────────────
    sqlx::query("SELECT 1")
        .execute(&pool)
        .await
        .map_err(|e| AppError::Internal(format!("Database health check failed: {}", e)))?;

    tracing::info!("✓ PostgreSQL connected successfully");
    Ok(pool)
}
