use uuid::Uuid;
use crate::db::pool::DbPool;
use crate::db::models::project::{Project, CreateProject, UpdateProject};
use crate::errors::AppResult;

pub async fn find_by_id(pool: &DbPool, id: Uuid) -> AppResult<Option<Project>> {
    let p = sqlx::query_as::<_, Project>("SELECT * FROM projects WHERE id = $1")
        .bind(id)
        .fetch_optional(pool)
        .await?;
    Ok(p)
}

pub async fn list_by_user(pool: &DbPool, user_id: Uuid) -> AppResult<Vec<Project>> {
    let rows = sqlx::query_as::<_, Project>(
        "SELECT * FROM projects WHERE user_id = $1 ORDER BY updated_at DESC"
    )
    .bind(user_id)
    .fetch_all(pool)
    .await?;
    Ok(rows)
}

pub async fn create(pool: &DbPool, user_id: Uuid, data: &CreateProject) -> AppResult<Project> {
    let p = sqlx::query_as::<_, Project>(
        r"INSERT INTO projects (user_id, name, description, source_code, language, is_public)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *"
    )
    .bind(user_id)
    .bind(&data.name)
    .bind(&data.description)
    .bind(&data.source_code)
    .bind(&data.language)
    .bind(data.is_public.unwrap_or(false))
    .fetch_one(pool)
    .await?;
    Ok(p)
}

pub async fn update(pool: &DbPool, id: Uuid, user_id: Uuid, data: &UpdateProject) -> AppResult<Option<Project>> {
    let p = sqlx::query_as::<_, Project>(
        r"UPDATE projects
          SET name        = COALESCE($3, name),
              description = COALESCE($4, description),
              source_code = COALESCE($5, source_code),
              is_public   = COALESCE($6, is_public),
              updated_at  = NOW()
          WHERE id = $1 AND user_id = $2
          RETURNING *"
    )
    .bind(id)
    .bind(user_id)
    .bind(&data.name)
    .bind(&data.description)
    .bind(&data.source_code)
    .bind(data.is_public)
    .fetch_optional(pool)
    .await?;
    Ok(p)
}

pub async fn delete(pool: &DbPool, id: Uuid, user_id: Uuid) -> AppResult<bool> {
    let result = sqlx::query("DELETE FROM projects WHERE id = $1 AND user_id = $2")
        .bind(id)
        .bind(user_id)
        .execute(pool)
        .await?;
    Ok(result.rows_affected() > 0)
}
