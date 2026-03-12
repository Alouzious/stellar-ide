use uuid::Uuid;
use crate::db::pool::DbPool;
use crate::db::models::deployment::Deployment;
use crate::errors::AppResult;

pub async fn create(pool: &DbPool, user_id: Uuid, project_id: Uuid, network: &str) -> AppResult<Deployment> {
    let d = sqlx::query_as::<_, Deployment>(
        r"INSERT INTO deployments (user_id, project_id, network, status)
          VALUES ($1, $2, $3, 'pending')
          RETURNING *"
    )
    .bind(user_id)
    .bind(project_id)
    .bind(network)
    .fetch_one(pool)
    .await?;
    Ok(d)
}

pub async fn update_status(
    pool: &DbPool, id: Uuid, status: &str,
    contract_id: Option<&str>, tx_hash: Option<&str>, error_message: Option<&str>,
) -> AppResult<Option<Deployment>> {
    let d = sqlx::query_as::<_, Deployment>(
        r"UPDATE deployments
          SET status        = $2,
              contract_id   = COALESCE($3, contract_id),
              tx_hash       = COALESCE($4, tx_hash),
              error_message = COALESCE($5, error_message),
              deployed_at   = CASE WHEN $2 = 'success' THEN NOW() ELSE deployed_at END
          WHERE id = $1
          RETURNING *"
    )
    .bind(id)
    .bind(status)
    .bind(contract_id)
    .bind(tx_hash)
    .bind(error_message)
    .fetch_optional(pool)
    .await?;
    Ok(d)
}

pub async fn list_by_user(pool: &DbPool, user_id: Uuid) -> AppResult<Vec<Deployment>> {
    let rows = sqlx::query_as::<_, Deployment>(
        "SELECT * FROM deployments WHERE user_id = $1 ORDER BY created_at DESC"
    )
    .bind(user_id)
    .fetch_all(pool)
    .await?;
    Ok(rows)
}
