// ============================================
// StellarIDE — Redis Pub/Sub Broadcaster
// Syncs collab ops across multiple server instances
// ============================================

use redis::aio::ConnectionManager;
use redis::AsyncCommands;
use crate::errors::AppResult;

pub async fn publish_to_room(
    redis: &mut ConnectionManager,
    project_id: &str,
    operation_json: &str,
) -> AppResult<()> {
    let channel = format!("collab:{}", project_id);
    redis
        .publish::<_, _, ()>(channel, operation_json)
        .await
        .map_err(|e| crate::errors::AppError::Redis(e))?;
    Ok(())
}
