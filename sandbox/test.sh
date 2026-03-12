#!/bin/bash
# ============================================
# StellarIDE — Contract Test Script
# Runs cargo tests for a Soroban contract
#
# Usage:
#   ./test.sh <contract_dir>
#
# Example:
#   ./test.sh /workspace/my_contract
# ============================================

set -euo pipefail

CONTRACT_DIR="${1:?Usage: test.sh <contract_dir>}"

echo "▶ Running tests for: ${CONTRACT_DIR}"

# ── Move into contract directory ──────────────
cd "${CONTRACT_DIR}"

# ── Run all tests ─────────────────────────────
# testutils feature enables Soroban test environment
cargo test \
    --features testutils \
    2>&1

EXIT_CODE=$?

if [ ${EXIT_CODE} -eq 0 ]; then
    echo "✓ All tests passed!"
else
    echo "✗ Tests failed (exit code: ${EXIT_CODE})"
fi

exit ${EXIT_CODE}
