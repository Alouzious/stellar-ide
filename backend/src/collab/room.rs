// ============================================
// StellarIDE — Collab Room Management
// Tracks connected users per project room
// ============================================

use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::{broadcast, RwLock};
use uuid::Uuid;

#[derive(Debug, Clone)]
pub struct CollabMessage {
    pub user_id: Uuid,
    pub username: String,
    pub operation: String,  // JSON-encoded OT operation
}

#[derive(Debug)]
pub struct Room {
    pub project_id: String,
    pub tx: broadcast::Sender<CollabMessage>,
    pub users: HashMap<Uuid, String>,  // user_id ��� username
}

impl Room {
    pub fn new(project_id: String) -> Self {
        let (tx, _) = broadcast::channel(128);
        Self {
            project_id,
            tx,
            users: HashMap::new(),
        }
    }

    pub fn subscribe(&self) -> broadcast::Receiver<CollabMessage> {
        self.tx.subscribe()
    }

    pub fn broadcast(&self, msg: CollabMessage) {
        let _ = self.tx.send(msg);
    }

    pub fn join(&mut self, user_id: Uuid, username: String) {
        self.users.insert(user_id, username);
    }

    pub fn leave(&mut self, user_id: &Uuid) {
        self.users.remove(user_id);
    }

    pub fn user_count(&self) -> usize {
        self.users.len()
    }
}

// ── Global room registry ──────────────────────
pub type RoomRegistry = Arc<RwLock<HashMap<String, Room>>>;

pub fn create_registry() -> RoomRegistry {
    Arc::new(RwLock::new(HashMap::new()))
}
