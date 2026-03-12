// ============================================
// StellarIDE — JWT Token Create / Verify
// ============================================

use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::errors::{AppError, AppResult};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: String,        // user UUID
    pub username: String,
    pub exp: i64,           // expiry timestamp
    pub iat: i64,           // issued at
}

pub fn create_token(
    user_id: Uuid,
    username: &str,
    secret: &str,
    expiry_hours: i64,
) -> AppResult<String> {
    let now = Utc::now();
    let expiry = now + Duration::hours(expiry_hours);

    let claims = Claims {
        sub: user_id.to_string(),
        username: username.to_string(),
        iat: now.timestamp(),
        exp: expiry.timestamp(),
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )?;

    Ok(token)
}

pub fn verify_token(token: &str, secret: &str) -> AppResult<Claims> {
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::default(),
    )
    .map_err(|e| AppError::Unauthorized(format!("Invalid token: {}", e)))?;

    Ok(token_data.claims)
}
