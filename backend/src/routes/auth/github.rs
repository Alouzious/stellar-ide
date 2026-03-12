// ============================================
// StellarIDE — GET /auth/github
// Redirects to GitHub OAuth + handles callback
// ============================================

use axum::{
    extract::{Query, State},
    response::Redirect,
    Json,
};
use crate::auth::github_oauth::{build_redirect_url, exchange_code, fetch_github_user};
use crate::auth::jwt::create_token;
use crate::db::queries::users;
use crate::db::models::user::CreateUser;
use crate::errors::AppResult;
use crate::models::requests::GitHubCallbackRequest;
use crate::models::responses::{AuthResponse, UserResponse};
use crate::AppState;

// ── GET /auth/github → redirect to GitHub ────
pub async fn github_redirect(State(state): State<AppState>) -> Redirect {
    let url = build_redirect_url(&state.config);
    Redirect::temporary(&url)
}

// ── GET /auth/github/callback ─────────────────
pub async fn github_callback(
    State(state): State<AppState>,
    Query(params): Query<GitHubCallbackRequest>,
) -> AppResult<Json<AuthResponse>> {
    // ── Exchange code for access token ────────
    let access_token = exchange_code(&params.code, &state.config).await?;

    // ── Fetch GitHub user ─────────────────────
    let gh_user = fetch_github_user(&access_token).await?;

    // ── Upsert user in DB ─────────────────────
    let user = users::create(
        &state.db,
        &CreateUser {
            github_id:  gh_user.id,
            username:   gh_user.login.clone(),
            email:      gh_user.email.clone(),
            avatar_url: gh_user.avatar_url.clone(),
        },
    )
    .await?;

    // ── Create JWT ────────────────────────────
    let token = create_token(
        user.id,
        &user.username,
        &state.config.jwt_secret,
        state.config.jwt_expiry_hours,
    )?;

    Ok(Json(AuthResponse {
        token,
        user: UserResponse {
            id:              user.id,
            username:        user.username,
            email:           user.email,
            avatar_url:      user.avatar_url,
            stellar_address: user.stellar_address,
            created_at:      user.created_at,
        },
    }))
}
