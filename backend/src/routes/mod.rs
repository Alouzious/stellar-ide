// ============================================
// StellarIDE — Route Registration
// Assembles all routes into one Axum Router
// ============================================

use axum::{
    middleware,
    routing::{delete, get, post, put},
    Router,
};
use crate::auth::middleware::require_auth;
use crate::AppState;

pub mod artifacts;
pub mod auth;
pub mod collab;
pub mod deploy;
pub mod health;
pub mod projects;
pub mod sandbox;
pub mod wallet;

pub fn build_router(state: AppState) -> Router {
    // ── Public routes (no auth) ───────────────
    let public = Router::new()
        .route("/health",                get(health::health_check))
        .route("/auth/github",           get(auth::github::github_redirect))
        .route("/auth/github/callback",  get(auth::github::github_callback));

    // ── Protected routes (JWT required) ───────
    let protected = Router::new()
        // Auth
        .route("/auth/me",               get(auth::login::me))
        .route("/auth/logout",           post(auth::logout::logout))
        .route("/auth/refresh",          post(auth::refresh::refresh))
        // Projects
        .route("/projects",              post(projects::create::create_project))
        .route("/projects",              get(projects::list::list_projects))
        .route("/projects/:id",          get(projects::get::get_project))
        .route("/projects/:id",          put(projects::update::update_project))
        .route("/projects/:id",          delete(projects::delete::delete_project))
        // Sandbox
        .route("/sandbox/compile",       post(sandbox::compile::compile))
        .route("/sandbox/test",          post(sandbox::test::test))
        .route("/sandbox/build",         post(sandbox::build::build))
        .route("/sandbox/audit",         post(sandbox::audit::audit))
        // Deploy
        .route("/deploy",                post(deploy::deploy::deploy))
        .route("/deploy/history",        get(deploy::history::history))
        .route("/deploy/interface",      post(deploy::interface::interface))
        // Artifacts
        .route("/artifacts/generate",    post(artifacts::generate::generate))
        .route("/artifacts/:id/download",get(artifacts::download::download))
        // Collab WebSocket
        .route("/collab/:project_id",    get(collab::websocket::collab_ws))
        // Wallet
        .route("/wallet/friendbot",      get(wallet::friendbot::friendbot))
        // Apply auth middleware to all protected routes
        .layer(middleware::from_fn_with_state(
            state.clone(),
            require_auth,
        ));

    // ── Merge all routes under /api/v1 ────────
    Router::new()
        .nest("/api/v1", public)
        .nest("/api/v1", protected)
        .with_state(state)
}
