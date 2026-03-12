// ============================================
// StellarIDE — JWT Session Storage in Redis
// ============================================

use redis::AsyncCommands;
use uuid::Uuid;
use crate::cache::client::RedisPool;
use crate::errors::AppResult;

const SESSION_PREFIX: &str = "session:";
const BLACKLIST_PREFIX: &str = "blacklist:";

// ── Store session ─────────────────────────────
pub async fn store_session(
    redis: &mut RedisPool,
    user_id: Uuid,
    token: &str,
    expiry_secs: u64,
) -> AppResult<()> {
    let key = format!("{}{}", SESSION_PREFIX, user_id);
    redis
        .set_ex::<_, _, ()>(key, token, expiry_secs)
        .await
        .map_err(|e| crate::errors::AppError::Redis(e))?;
    Ok(())
}

// ── Blacklist token (logout) ──────────────────
pub async fn blacklist_token(
    redis: &mut RedisPool,
    token: &str,
    expiry_secs: u64,
) -> AppResult<()> {
    let key = format!("{}{}", BLACKLIST_PREFIX, token);
    redis
        .set_ex::<_, _, ()>(key, "1", expiry_secs)
        .await
        .map_err(|e| crate::errors::AppError::Redis(e))?;
    Ok(())
}

// ── Check if token is blacklisted ────────────
pub async fn is_blacklisted(
    redis: &mut RedisPool,
    token: &str,
) -> AppResult<bool> {
    let key = format!("{}{}", BLACKLIST_PREFIX, token);
    let exists: bool = redis
        .exists(key)
        .await
        .map_err(|e| crate::errors::AppError::Redis(e))?;
    Ok(exists)
}

// ── Delete session ────────────────────────────
pub async fn delete_session(
    redis: &mut RedisPool,
    user_id: Uuid,
) -> AppResult<()> {
    let key = format!("{}{}", SESSION_PREFIX, user_id);
    redis
        .del::<_, ()>(key)
        .await
        .map_err(|e| crate::errors::AppError::Redis(e))?;
    Ok(())
}
