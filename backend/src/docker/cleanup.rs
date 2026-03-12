// ============================================
// StellarIDE — Auto Cleanup Idle Containers
// Runs every 60s to remove dead/exited containers
// ============================================

use tokio::time::{interval, Duration};
use tracing::{error, info};

pub async fn start_cleanup_task() {
    let mut ticker = interval(Duration::from_secs(60));

    loop {
        ticker.tick().await;

        match cleanup_exited_containers().await {
            Ok(count) => {
                if count > 0 {
                    info!("Cleaned up {} exited sandbox containers", count);
                }
            }
            Err(e) => {
                error!("Container cleanup error: {}", e);
            }
        }
    }
}

async fn cleanup_exited_containers() -> Result<usize, String> {
    let output = tokio::process::Command::new("docker")
        .args([
            "ps", "-aq",
            "--filter", "status=exited",
            "--filter", "label=stellaride.sandbox=true",
        ])
        .output()
        .await
        .map_err(|e| e.to_string())?;

    let ids = String::from_utf8_lossy(&output.stdout);
    let ids: Vec<&str> = ids.lines().filter(|l| !l.is_empty()).collect();

    if ids.is_empty() {
        return Ok(0);
    }

    let count = ids.len();
    let mut args = vec!["rm", "-f"];
    args.extend_from_slice(&ids);

    tokio::process::Command::new("docker")
        .args(&args)
        .output()
        .await
        .map_err(|e| e.to_string())?;

    Ok(count)
}
