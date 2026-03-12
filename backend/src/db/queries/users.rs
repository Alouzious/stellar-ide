use uuid::Uuid;
use crate::db::pool::DbPool;
use crate::db::models::user::{User, CreateUser, UpdateUser};
use crate::errors::AppResult;

pub async fn find_by_id(pool: &DbPool, id: Uuid) -> AppResult<Option<User>> {
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
        .bind(id)
        .fetch_optional(pool)
        .await?;
    Ok(user)
}

pub async fn find_by_github_id(pool: &DbPool, github_id: i64) -> AppResult<Option<User>> {
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE github_id = $1")
        .bind(github_id)
        .fetch_optional(pool)
        .await?;
    Ok(user)
}

pub async fn create(pool: &DbPool, data: &CreateUser) -> AppResult<User> {
    let user = sqlx::query_as::<_, User>(
        r"INSERT INTO users (github_id, username, email, avatar_url)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (github_id) DO UPDATE
              SET username   = EXCLUDED.username,
                  email      = EXCLUDED.email,
                  avatar_url = EXCLUDED.avatar_url,
                  updated_at = NOW()
          RETURNING *"
    )
    .bind(data.github_id)
    .bind(&data.username)
    .bind(&data.email)
    .bind(&data.avatar_url)
    .fetch_one(pool)
    .await?;
    Ok(user)
}

pub async fn update(pool: &DbPool, id: Uuid, data: &UpdateUser) -> AppResult<Option<User>> {
    let user = sqlx::query_as::<_, User>(
        r"UPDATE users
          SET email           = COALESCE($2, email),
              avatar_url      = COALESCE($3, avatar_url),
              stellar_address = COALESCE($4, stellar_address),
              updated_at      = NOW()
          WHERE id = $1
          RETURNING *"
    )
    .bind(id)
    .bind(&data.email)
    .bind(&data.avatar_url)
    .bind(&data.stellar_address)
    .fetch_optional(pool)
    .await?;
    Ok(user)
}
