// ============================================
// StellarIDE — POST /sandbox/compile (SSE streaming)
// ============================================

use axum::{
    extract::State,
    response::sse::{Event, Sse},
};
use futures::stream::{self, Stream};
use std::convert::Infallible;
use axum::Json;
use crate::docker::runner::{run_in_sandbox, make_sse_event, make_sse_done};
use crate::errors::AppResult;
use crate::models::requests::SandboxRequest;
use crate::AppState;

pub async fn compile(
    State(state): State<AppState>,
    Json(body): Json<SandboxRequest>,
) -> AppResult<Sse<impl Stream<Item = Result<Event, Infallible>>>> {
    // ── Acquire semaphore slot ────────────────
    let _permit = state.semaphore.acquire().await?;

    // ── Run compile in sandbox ────────────────
    let result = run_in_sandbox(
        &state.config.sandbox_image,
        &body.source_code,
        &["stellar", "contract", "build", "--manifest-path", "/workspace/Cargo.toml"],
        state.config.sandbox_timeout_secs,
    )
    .await;

    // ── Stream results as SSE ─────────────────
    let events: Vec<Result<Event, Infallible>> = match result {
        Ok(output) => {
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
