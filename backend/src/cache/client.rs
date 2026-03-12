// ============================================
// StellarIDE — Redis Connection
// deadpool-redis async connection pool
// ============================================

use redis::aio::ConnectionManager;
use redis::Client;
use crate::config::Config;
use crate::errors::AppError;

pub type RedisPool = ConnectionManager;

pub async fn create_client(config: &Config) -> Result<RedisPool, AppError> {
    tracing::info!("Connecting to Redis...");

    let client = Client::open(config.redis_url.as_str())
        .map_err(|e| AppError::Internal(format!("Failed to create Redis client: {}", e)))?;

    let manager = ConnectionManager::new(client)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to connect to Redis: {}", e)))?;

    tracing::info!("✓ Redis connected successfully");
    Ok(manager)
}
