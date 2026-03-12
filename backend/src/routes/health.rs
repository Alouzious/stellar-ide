use axum::{extract::State, Json};
use crate::errors::AppResult;
use crate::models::responses::HealthResponse;
use crate::AppState;

pub async fn health_check(State(state): State<AppState>) -> AppResult<Json<HealthResponse>> {
    let db_status = match sqlx::query("SELECT 1").execute(&state.db).await {
        Ok(_)  => "healthy".to_string(),
        Err(e) => format!("unhealthy: {}", e),
    };

    let redis_status = {
        let mut redis = state.redis.clone();
        match redis::cmd("PING").query_async::<_, String>(&mut redis).await {
            Ok(_)  => "healthy".to_string(),
            Err(e) => format!("unhealthy: {}", e),
        }
    };

    Ok(Json(HealthResponse {
        status:   "ok".to_string(),
        version:  env!("CARGO_PKG_VERSION").to_string(),
        database: db_status,
        redis:    redis_status,
    }))
}
