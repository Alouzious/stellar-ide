#![allow(dead_code, unused_imports)]
// ============================================
// StellarIDE — Entry Point
// Server startup, state wiring, graceful shutdown
// ============================================

use std::net::SocketAddr;
use tokio::signal;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod artifacts;
mod auth;
mod cache;
mod collab;
mod config;
mod db;
mod docker;
mod errors;
mod models;
mod routes;

use cache::create_client;
use collab::{RoomRegistry, create_registry};
use config::Config;
use db::create_pool;
use docker::BuildSemaphore;

// ── Shared application state ──────────────────
#[derive(Clone)]
pub struct AppState {
    pub db:        db::DbPool,
    pub redis:     cache::RedisPool,
    pub config:    Config,
    pub semaphore: BuildSemaphore,
    pub rooms:     RoomRegistry,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // ── Tracing / logging ─────────────────────
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::try_from_default_env()
            .unwrap_or_else(|_| "stellaride=debug,tower_http=info".into()))
        .with(tracing_subscriber::fmt::layer())
        .init();

    tracing::info!("🚀 StellarIDE backend starting...");

    // ── Load config ───────────────────────────
    let config = Config::from_env()?;
    tracing::info!("✓ Config loaded (port={})", config.port);

    // ── Connect PostgreSQL ────────────────────
    let db = create_pool(&config).await?;

    // ── Connect Redis ─────────────────────────
    let redis = create_client(&config).await?;

    // ── Build semaphore ───────────────────────
    let semaphore = BuildSemaphore::new(config.max_sandboxes);
    tracing::info!("✓ Sandbox semaphore ready (max={})", config.max_sandboxes);

    // ── Collab room registry ──────────────────
    let rooms = create_registry();

    // ── Assemble app state ────────────────────
    let state = AppState {
        db,
        redis,
        config: config.clone(),
        semaphore,
        rooms,
    };

    // ── Start container cleanup task ──────────
    tokio::spawn(docker::cleanup::start_cleanup_task());

    // ── Build router ──────────────────────────
    let app = routes::build_router(state)
        .layer(
            tower_http::cors::CorsLayer::new()
                .allow_origin(tower_http::cors::Any)
                .allow_methods(tower_http::cors::Any)
                .allow_headers(tower_http::cors::Any),
        )
        .layer(tower_http::trace::TraceLayer::new_for_http());

    // ── Bind & serve ──────────────────────────
    let addr = SocketAddr::from(([0, 0, 0, 0], config.port));
    tracing::info!("✓ Listening on http://{}", addr);

    axum::serve(
        tokio::net::TcpListener::bind(addr).await?,
        app,
    )
    .with_graceful_shutdown(shutdown_signal())
    .await?;

    tracing::info!("👋 StellarIDE backend shut down gracefully");
    Ok(())
}

// ── Graceful shutdown on Ctrl+C / SIGTERM ────
async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c().await.expect("Failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("Failed to install SIGTERM handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c    => tracing::info!("Received Ctrl+C"),
        _ = terminate => tracing::info!("Received SIGTERM"),
    }
}
