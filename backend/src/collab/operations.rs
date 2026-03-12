// ============================================
// StellarIDE — Operational Transforms (OT)
// Basic insert/delete OT for collaborative editing
// ============================================

use serde::{Deserialize, Serialize};
use crate::errors::{AppError, AppResult};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "lowercase")]
pub enum Operation {
    Insert {
        position: usize,
        text: String,
        revision: u64,
    },
    Delete {
        position: usize,
        length: usize,
        revision: u64,
    },
    Cursor {
        position: usize,
        user_id: String,
        username: String,
    },
}

// ── Transform op against concurrent op ───────
pub fn transform(op: &Operation, against: &Operation) -> AppResult<Operation> {
    match (op, against) {
        (
            Operation::Insert { position, text, revision },
            Operation::Insert { position: other_pos, text: other_text, .. },
        ) => {
            let new_pos = if other_pos <= position {
                position + other_text.len()
            } else {
                *position
            };
            Ok(Operation::Insert {
                position: new_pos,
                text: text.clone(),
                revision: *revision,
            })
        }

        (
            Operation::Insert { position, text, revision },
            Operation::Delete { position: other_pos, length, .. },
        ) => {
            let new_pos = if other_pos < position {
                position.saturating_sub(*length)
            } else {
                *position
            };
            Ok(Operation::Insert {
                position: new_pos,
                text: text.clone(),
                revision: *revision,
            })
        }

        (
            Operation::Delete { position, length, revision },
            Operation::Insert { position: other_pos, text: other_text, .. },
        ) => {
            let new_pos = if other_pos <= position {
                position + other_text.len()
            } else {
                *position
            };
            Ok(Operation::Delete {
                position: new_pos,
                length: *length,
                revision: *revision,
            })
        }

        (
            Operation::Delete { position, length, revision },
            Operation::Delete { position: other_pos, length: other_len, .. },
        ) => {
            let new_pos = if other_pos < position {
                position.saturating_sub(*other_len)
            } else {
                *position
            };
            Ok(Operation::Delete {
                position: new_pos,
                length: *length,
                revision: *revision,
            })
        }

        // Cursor ops don't transform
        (op, _) => Ok(op.clone()),
    }
}

// ── Apply operation to document ───────────────
pub fn apply(document: &str, op: &Operation) -> AppResult<String> {
    match op {
        Operation::Insert { position, text, .. } => {
            if *position > document.len() {
                return Err(AppError::BadRequest(
                    format!("Insert position {} out of bounds (doc len {})", position, document.len())
                ));
            }
            let mut result = document.to_string();
            result.insert_str(*position, text);
            Ok(result)
        }

        Operation::Delete { position, length, .. } => {
            if position + length > document.len() {
                return Err(AppError::BadRequest(
                    format!("Delete range {}..{} out of bounds", position, position + length)
                ));
            }
            let mut result = document.to_string();
            result.drain(*position..*position + *length);
            Ok(result)
        }

        Operation::Cursor { .. } => Ok(document.to_string()),
    }
}
