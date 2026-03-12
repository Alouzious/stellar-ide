// ============================================
// StellarIDE — WS /collab/:project_id
// Real-time collaborative editing via WebSocket
// ============================================

use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        Extension, Path, State,
    },
    response::IntoResponse,
};
use futures::{SinkExt, StreamExt};
use crate::auth::middleware::AuthUser;
use crate::collab::{CollabMessage, Operation};
use crate::AppState;

pub async fn collab_ws(
    ws: WebSocketUpgrade,
    State(state): State<AppState>,
    Extension(auth_user): Extension<AuthUser>,
    Path(project_id): Path<String>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| {
        handle_socket(socket, state, auth_user, project_id)
    })
}

async fn handle_socket(
    socket: WebSocket,
    state: AppState,
    auth_user: AuthUser,
    project_id: String,
) {
    let (mut sender, mut receiver) = socket.split();

    // ── Join room ─────────────────────────────
    {
        let mut registry = state.rooms.write().await;
        let room = registry
            .entry(project_id.clone())
            .or_insert_with(|| crate::collab::Room::new(project_id.clone()));
        room.join(auth_user.id, auth_user.username.clone());
    }

    // ── Subscribe to room broadcast ───────────
    let rx = {
        let registry = state.rooms.read().await;
        registry.get(&project_id).map(|r| r.subscribe())
    };

    let mut rx = match rx {
        Some(r) => r,
        None => return,
    };

    // ── Announce join ─────────────────────────
    let join_msg = serde_json::json!({
        "type": "join",
        "user_id": auth_user.id,
        "username": auth_user.username,
    });
    let _ = sender.send(Message::Text(join_msg.to_string())).await;

    // ── Receive loop ──────────────────────────
    let state_clone = state.clone();
    let project_id_clone = project_id.clone();
    let user_id = auth_user.id;
    let username = auth_user.username.clone();

    let mut recv_task = tokio::spawn(async move {
        while let Some(Ok(msg)) = receiver.next().await {
            if let Message::Text(text) = msg {
                // ── Parse operation ───────────
                if let Ok(op) = serde_json::from_str::<Operation>(&text) {
                    let registry = state_clone.rooms.read().await;
                    if let Some(room) = registry.get(&project_id_clone) {
                        room.broadcast(CollabMessage {
                            user_id,
                            username: username.clone(),
                            operation: text,
                        });
                    }
                }
            } else if let Message::Close(_) = msg {
                break;
            }
        }
    });

    // ── Broadcast loop ────────────────────────
    let mut send_task = tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            // Don't echo back to sender
            if msg.user_id == auth_user.id {
                continue;
            }
            let payload = serde_json::json!({
                "type": "operation",
                "user_id": msg.user_id,
                "username": msg.username,
                "operation": msg.operation,
            });
            if sender.send(Message::Text(payload.to_string())).await.is_err() {
                break;
            }
        }
    });

    // ── Wait for either task to finish ────────
    tokio::select! {
        _ = &mut recv_task => send_task.abort(),
        _ = &mut send_task => recv_task.abort(),
    }

    // ── Leave room ────────────────────────────
    let mut registry = state.rooms.write().await;
    if let Some(room) = registry.get_mut(&project_id) {
        room.leave(&user_id);
        if room.user_count() == 0 {
            registry.remove(&project_id);
        }
    }
}
