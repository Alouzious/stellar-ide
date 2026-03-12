#!/bin/bash
# ============================================
# StellarIDE — Contract Audit Script
# Runs Scout security audit on a Soroban contract
#
# Usage:
#   ./audit.sh <contract_dir>
#
# Example:
#   ./audit.sh /workspace/my_contract
# ============================================

set -euo pipefail

CONTRACT_DIR="${1:?Usage: audit.sh <contract_dir>}"

echo "▶ Running security audit on: ${CONTRACT_DIR}"

# ── Move into contract directory ──────────────
cd "${CONTRACT_DIR}"

# ── Run Scout Audit ───────────────────────────
# Output in JSON format so backend can parse it
cargo scout-audit \
    --output-format json \
    2>&1

EXIT_CODE=$?

if [ ${EXIT_CODE} -eq 0 ]; then
    echo "✓ Audit complete — no issues found"
else
    echo "⚠ Audit complete — issues detected (exit code: ${EXIT_CODE})"
fi

exit ${EXIT_CODE}
