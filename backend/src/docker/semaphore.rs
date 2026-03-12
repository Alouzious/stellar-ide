// ============================================
// StellarIDE — Sandbox Concurrency Limiter
// Max N simultaneous sandbox builds
// ============================================

use std::sync::Arc;
use tokio::sync::Semaphore;

#[derive(Clone)]
pub struct BuildSemaphore {
    inner: Arc<Semaphore>,
}

impl BuildSemaphore {
    pub fn new(max_concurrent: u32) -> Self {
        Self {
            inner: Arc::new(Semaphore::new(max_concurrent as usize)),
        }
    }

    pub async fn acquire(&self) -> Result<tokio::sync::SemaphorePermit<'_>, crate::errors::AppError> {
        self.inner
            .acquire()
            .await
            .map_err(|e| crate::errors::AppError::Internal(format!("Semaphore error: {}", e)))
    }

    pub fn available(&self) -> usize {
        self.inner.available_permits()
    }
}
