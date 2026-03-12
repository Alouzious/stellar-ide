// ============================================
// StellarIDE — CLI Output Parser
// Parses stellar CLI output → Contract ID + ABI
// ============================================

use serde_json::Value;
use crate::errors::{AppError, AppResult};

pub struct ParsedDeployment {
    pub contract_id: String,
    pub tx_hash: Option<String>,
}

pub struct ParsedAbi {
    pub abi: Value,
    pub wasm_hash: Option<String>,
}

// ── Parse stellar contract deploy output ─────
pub fn parse_deploy_output(output: &str) -> AppResult<ParsedDeployment> {
    // stellar CLI outputs contract ID on success line:
    // "Contract deployed successfully with ID: C..."
    // or just the contract ID on stdout

    for line in output.lines() {
        let line = line.trim();

        // Direct contract ID (starts with C, 56 chars)
        if line.starts_with('C') && line.len() == 56 && line.chars().all(|c| c.is_alphanumeric()) {
            return Ok(ParsedDeployment {
                contract_id: line.to_string(),
                tx_hash: None,
            });
        }

        // "contract_id: CXXX..."
        if let Some(id) = line.strip_prefix("contract_id:") {
            let id = id.trim().to_string();
            return Ok(ParsedDeployment {
                contract_id: id,
                tx_hash: None,
            });
        }

        // JSON output from newer CLI versions
        if line.starts_with('{') {
            if let Ok(json) = serde_json::from_str::<Value>(line) {
                if let Some(id) = json.get("contract_id").and_then(|v| v.as_str()) {
                    let tx = json.get("tx_hash")
                        .and_then(|v| v.as_str())
                        .map(|s| s.to_string());
                    return Ok(ParsedDeployment {
                        contract_id: id.to_string(),
                        tx_hash: tx,
                    });
                }
            }
        }
    }

    Err(AppError::Internal(
        format!("Could not parse contract ID from output: {}", &output[..output.len().min(200)])
    ))
}

// ── Parse stellar contract inspect ABI ───────
pub fn parse_abi_output(output: &str) -> AppResult<ParsedAbi> {
    // Try to parse the whole output as JSON first
    if let Ok(abi) = serde_json::from_str::<Value>(output.trim()) {
        return Ok(ParsedAbi {
            abi,
            wasm_hash: None,
        });
    }

    // Find JSON block in mixed output
    for line in output.lines() {
        let line = line.trim();
        if line.starts_with('{') || line.starts_with('[') {
            if let Ok(abi) = serde_json::from_str::<Value>(line) {
                return Ok(ParsedAbi {
                    abi,
                    wasm_hash: None,
                });
            }
        }
    }

    // Return empty ABI if we can't parse
    Ok(ParsedAbi {
        abi: serde_json::json!({ "functions": [], "raw": output }),
        wasm_hash: None,
    })
}
