use uuid::Uuid;
use crate::db::pool::DbPool;
use crate::db::models::artifact::Artifact;
use crate::errors::AppResult;

pub async fn find_by_id(pool: &DbPool, id: Uuid) -> AppResult<Option<Artifact>> {
    let a = sqlx::query_as::<_, Artifact>("SELECT * FROM artifacts WHERE id = $1")
        .bind(id)
        .fetch_optional(pool)
        .await?;
    Ok(a)
}

pub async fn list_by_user(pool: &DbPool, user_id: Uuid) -> AppResult<Vec<Artifact>> {
    let rows = sqlx::query_as::<_, Artifact>(
        "SELECT * FROM artifacts WHERE user_id = $1 ORDER BY created_at DESC"
    )
    .bind(user_id)
    .fetch_all(pool)
    .await?;
    Ok(rows)
}

pub async fn create(
    pool: &DbPool, deployment_id: Uuid, user_id: Uuid,
    contract_id: &str, abi: serde_json::Value,
    wasm_hash: Option<&str>, ts_client: Option<&str>, zip_path: Option<&str>,
) -> AppResult<Artifact> {
    let a = sqlx::query_as::<_, Artifact>(
        r"INSERT INTO artifacts
              (deployment_id, user_id, contract_id, abi, wasm_hash, ts_client, zip_path)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *"
    )
    .bind(deployment_id)
    .bind(user_id)
    .bind(contract_id)
    .bind(abi)
    .bind(wasm_hash)
    .bind(ts_client)
    .bind(zip_path)
    .fetch_one(pool)
    .await?;
    Ok(a)
}
