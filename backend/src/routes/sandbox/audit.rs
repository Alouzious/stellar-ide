// ============================================
// StellarIDE — POST /sandbox/audit (SSE streaming)
// Runs cargo clippy + cargo audit in sandbox
// ============================================

use axum::{extract::State, response::sse::{Event, Sse}, Json};
use futures::stream::{self, Stream};
use std::convert::Infallible;
use crate::docker::runner::{run_in_sandbox, make_sse_event, make_sse_done};
use crate::errors::AppResult;
use crate::models::requests::SandboxRequest;
use crate::AppState;

pub async fn audit(
    State(state): State<AppState>,
    Json(body): Json<SandboxRequest>,
) -> AppResult<Sse<impl Stream<Item = Result<Event, Infallible>>>> {
    let _permit = state.semaphore.acquire().await?;

    // ── Run clippy ────────────────────────────
    let clippy = run_in_sandbox(
        &state.config.sandbox_image,
        &body.source_code,
        &["cargo", "clippy", "--", "-D", "warnings"],
        state.config.sandbox_timeout_secs,
    )
    .await;

    let mut events: Vec<Result<Event, Infallible>> = Vec::new();

    events.push(Ok(make_sse_event("stdout", "=== cargo clippy ===").unwrap()));
    match clippy {
        Ok(output) => {
            if !output.stdout.is_empty() {
                events.push(Ok(make_sse_event("stdout", &output.stdout).unwrap()));
            }
            if !output.stderr.is_empty() {
                events.push(Ok(make_sse_event("stderr", &output.stderr).unwrap()));
            }
        }
        Err(e) => events.push(Ok(make_sse_event("error", &e.to_string()).unwrap())),
    }

    // ── Run cargo audit ───────────────────────
    let audit_result = run_in_sandbox(
        &state.config.sandbox_image,
        &body.source_code,
        &["cargo", "audit"],
        state.config.sandbox_timeout_secs,
    )
    .await;

    events.push(Ok(make_sse_event("stdout", "=== cargo audit ===").unwrap()));
    match audit_result {
        Ok(output) => {
            if !output.stdout.is_empty() {
                events.push(Ok(make_sse_event("stdout", &output.stdout).unwrap()));
            }
            if !output.stderr.is_empty() {
                events.push(Ok(make_sse_event("stderr", &output.stderr).unwrap()));
            }
            events.push(Ok(make_sse_done(output.exit_code).unwrap()));
        }
        Err(e) => {
            events.push(Ok(make_sse_event("error", &e.to_string()).unwrap()));
            events.push(Ok(make_sse_done(-1).unwrap()));
        }
    }

    Ok(Sse::new(stream::iter(events)))
}
