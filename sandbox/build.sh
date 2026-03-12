#!/bin/bash
# ============================================
# StellarIDE — Contract Build Script
# Compiles a Soroban smart contract to WASM
#
# Usage:
#   ./build.sh <contract_dir> <contract_name>
#
# Example:
#   ./build.sh /workspace/my_contract my_contract
# ============================================

set -euo pipefail

CONTRACT_DIR="${1:?Usage: build.sh <contract_dir> <contract_name>}"
CONTRACT_NAME="${2:?Usage: build.sh <contract_dir> <contract_name>}"

echo "▶ Building contract: ${CONTRACT_NAME}"
echo "▶ Directory:         ${CONTRACT_DIR}"

# ── Move into contract directory ──────────────
cd "${CONTRACT_DIR}"

# ── Compile to WASM ───────────────────────────
cargo build \
    --target wasm32-unknown-unknown \
    --release \
    2>&1

# ── Locate the compiled WASM file ────────────
WASM_FILE="target/wasm32-unknown-unknown/release/${CONTRACT_NAME}.wasm"

if [ ! -f "${WASM_FILE}" ]; then
    echo "✗ Build failed: WASM file not found at ${WASM_FILE}"
    exit 1
fi

WASM_SIZE=$(wc -c < "${WASM_FILE}")
echo "✓ Build successful!"
echo "✓ WASM file: ${WASM_FILE}"
echo "✓ WASM size: ${WASM_SIZE} bytes"

# ── Optimize with stellar optimizer ──────────
echo "▶ Optimizing WASM..."
stellar contract optimize \
    --wasm "${WASM_FILE}" \
    2>&1 || echo "⚠ Optimization skipped (stellar CLI not available)"

# ── Output path for backend to read ──────────
echo "WASM_PATH=${WASM_FILE}"
