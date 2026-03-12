// ============================================
// StellarIDE — Collab State via Redis Pub/Sub
// ============================================

use redis::AsyncCommands;
use crate::cache::client::RedisPool;
use crate::errors::AppResult;

const COLLAB_PREFIX: &str = "collab:";

pub async fn publish_operation(
    redis: &mut RedisPool,
    project_id: &str,
    operation: &str,
) -> AppResult<()> {
    let channel = format!("{}{}", COLLAB_PREFIX, project_id);
    redis
        .publish::<_, _, ()>(channel, operation)
        .await
        .map_err(|e| crate::errors::AppError::Redis(e))?;
    Ok(())
}

pub async fn set_room_state(
    redis: &mut RedisPool,
    project_id: &str,
    state: &str,
) -> AppResult<()> {
    let key = format!("{}state:{}", COLLAB_PREFIX, project_id);
    redis
        .set_ex::<_, _, ()>(key, state, 86400)
        .await
        .map_err(|e| crate::errors::AppError::Redis(e))?;
    Ok(())
}

pub async fn get_room_state(
    redis: &mut RedisPool,
    project_id: &str,
) -> AppResult<Option<String>> {
    let key = format!("{}state:{}", COLLAB_PREFIX, project_id);
    let state: Option<String> = redis
        .get(key)
        .await
        .map_err(|e| crate::errors::AppError::Redis(e))?;
    Ok(state)
}
