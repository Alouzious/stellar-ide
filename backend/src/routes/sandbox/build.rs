// ============================================
// StellarIDE — POST /sandbox/build (SSE streaming)
// Builds WASM binary via stellar contract build
// ============================================

use axum::{extract::State, response::sse::{Event, Sse}, Json};
use futures::stream::{self, Stream};
use std::convert::Infallible;
use crate::cache::build_cache::{hash_source, get_cached_build, cache_build_result};
use crate::docker::runner::{run_in_sandbox, make_sse_event, make_sse_done};
use crate::errors::AppResult;
use crate::models::requests::SandboxRequest;
use crate::AppState;

pub async fn build(
    State(state): State<AppState>,
    Json(body): Json<SandboxRequest>,
) -> AppResult<Sse<impl Stream<Item = Result<Event, Infallible>>>> {
    // ── Check build cache ─────────────────────
    let hash = hash_source(&body.source_code);
    let mut redis = state.redis.clone();

    if let Ok(Some(cached)) = get_cached_build(&mut redis, &hash).await {
        let events = vec![
            Ok(make_sse_event("stdout", &cached).unwrap()),
            Ok(make_sse_event("stdout", "[cached result]").unwrap()),
            Ok(make_sse_done(0).unwrap()),
        ];
        return Ok(Sse::new(stream::iter(events)));
    }

    // ── Acquire semaphore slot ────────────────
    let _permit = state.semaphore.acquire().await?;

    // ── Run build in sandbox ──────────────────
    let result = run_in_sandbox(
        &state.config.sandbox_image,
        &body.source_code,
        &[
            "stellar", "contract", "build",
            "--manifest-path", "/workspace/Cargo.toml",
            "--release",
        ],
        state.config.sandbox_timeout_secs,
    )
    .await;

    let events: Vec<Result<Event, Infallible>> = match result {
        Ok(output) => {
            // ── Cache successful builds ───────
            if output.exit_code == 0 && !output.stdout.is_empty() {
                let _ = cache_build_result(&mut redis, &hash, &output.stdout).await;
            }
            let mut evts = Vec::new();
            if !output.stdout.is_empty() {
                evts.push(Ok(make_sse_event("stdout", &output.stdout).unwrap()));
            }
            if !output.stderr.is_empty() {
                evts.push(Ok(make_sse_event("stderr", &output.stderr).unwrap()));
            }
            evts.push(Ok(make_sse_done(output.exit_code).unwrap()));
            evts
        }
        Err(e) => vec![
            Ok(make_sse_event("error", &e.to_string()).unwrap()),
            Ok(make_sse_done(-1).unwrap()),
        ],
    };

    Ok(Sse::new(stream::iter(events)))
}
