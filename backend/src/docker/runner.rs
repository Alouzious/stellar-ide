// ============================================
// StellarIDE — Docker Sandbox Runner
// ============================================

use axum::response::sse::Event;
use serde_json::json;
use std::process::Stdio;
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::Command;
use tokio::time::{timeout, Duration};
use crate::errors::{AppError, AppResult};

pub struct RunResult {
    pub stdout: String,
    pub stderr: String,
    pub exit_code: i32,
}

pub async fn run_in_sandbox(
    image: &str,
    source_code: &str,
    command: &[&str],
    timeout_secs: u64,
) -> AppResult<RunResult> {
    let tmp_dir = tempfile::tempdir()
        .map_err(|e| AppError::Internal(format!("Failed to create temp dir: {}", e)))?;
    let src_path = tmp_dir.path().join("contract.rs");
    tokio::fs::write(&src_path, source_code)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to write source: {}", e)))?;

    // ── Build volume mount string first ───────
    let volume_mount = format!("{}:/workspace:ro", tmp_dir.path().display());

    let mut docker_args = vec![
        "run", "--rm",
        "--memory", "512m",
        "--cpus", "1.0",
        "--network", "none",
        "--read-only",
        "--tmpfs", "/tmp:rw,size=128m",
        "-v", &volume_mount,
        "-w", "/workspace",
        image,
    ];
    docker_args.extend_from_slice(command);

    let result = timeout(
        Duration::from_secs(timeout_secs),
        execute_command(&docker_args),
    )
    .await
    .map_err(|_| AppError::Internal(format!("Sandbox timed out after {}s", timeout_secs)))??;

    Ok(result)
}

async fn execute_command(args: &[&str]) -> AppResult<RunResult> {
    let mut child = Command::new("docker")
        .args(args)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| AppError::Internal(format!("Failed to spawn docker: {}", e)))?;

    let stdout_handle = child.stdout.take().unwrap();
    let stderr_handle = child.stderr.take().unwrap();

    let mut stdout_lines = BufReader::new(stdout_handle).lines();
    let mut stderr_lines = BufReader::new(stderr_handle).lines();

    let mut stdout = String::new();
    let mut stderr = String::new();

    while let Some(line) = stdout_lines.next_line().await
        .map_err(|e| AppError::Internal(e.to_string()))? {
        stdout.push_str(&line);
        stdout.push('\n');
    }

    while let Some(line) = stderr_lines.next_line().await
        .map_err(|e| AppError::Internal(e.to_string()))? {
        stderr.push_str(&line);
        stderr.push('\n');
    }

    let status = child.wait().await
        .map_err(|e| AppError::Internal(format!("Failed to wait for docker: {}", e)))?;

    Ok(RunResult {
        stdout,
        stderr,
        exit_code: status.code().unwrap_or(-1),
    })
}

pub fn make_sse_event(event_type: &str, data: &str) -> AppResult<Event> {
    let payload = json!({ "type": event_type, "data": data });
    Ok(Event::default().data(payload.to_string()))
}

pub fn make_sse_done(exit_code: i32) -> AppResult<Event> {
    let payload = json!({ "type": "done", "data": "", "exit_code": exit_code });
    Ok(Event::default().data(payload.to_string()))
}
