// ============================================
// StellarIDE — Build Result Cache
// SHA-256 hash of source → cached build output
// ============================================

use redis::AsyncCommands;
use crate::cache::client::RedisPool;
use crate::errors::AppResult;

const BUILD_CACHE_PREFIX: &str = "build:";
const BUILD_CACHE_TTL: u64 = 3600; // 1 hour

pub fn hash_source(source: &str) -> String {
    use std::collections::hash_map::DefaultHasher;
    use std::hash::{Hash, Hasher};
    let mut hasher = DefaultHasher::new();
    source.hash(&mut hasher);
    format!("{:x}", hasher.finish())
}

pub async fn get_cached_build(
    redis: &mut RedisPool,
    source_hash: &str,
) -> AppResult<Option<String>> {
    let key = format!("{}{}", BUILD_CACHE_PREFIX, source_hash);
    let result: Option<String> = redis
        .get(key)
        .await
        .map_err(|e| crate::errors::AppError::Redis(e))?;
    Ok(result)
}

pub async fn cache_build_result(
    redis: &mut RedisPool,
    source_hash: &str,
    result: &str,
) -> AppResult<()> {
    let key = format!("{}{}", BUILD_CACHE_PREFIX, source_hash);
    redis
        .set_ex::<_, _, ()>(key, result, BUILD_CACHE_TTL)
        .await
        .map_err(|e| crate::errors::AppError::Redis(e))?;
    Ok(())
}

