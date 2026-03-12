#!/bin/bash
# ============================================
# StellarIDE — Database Migration Script
# Runs all pending SQL migrations in order
# ============================================

set -euo pipefail

echo "▶ Running database migrations..."

# ── Load .env ─────────────────────────────────
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_NAME="${POSTGRES_DB:-stellar_ide}"
DB_USER="${POSTGRES_USER:-stellar}"
DB_PASS="${POSTGRES_PASSWORD:-stellar_pass}"

export PGPASSWORD="${DB_PASS}"

MIGRATIONS_DIR="./migrations"

# ── Run each migration in order ──────────────
for file in "${MIGRATIONS_DIR}"/*.sql; do
    filename=$(basename "$file")
    echo "  ▶ Applying ${filename}..."

    psql \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        -f "${file}" \
        2>&1

    echo "  ✓ ${filename} applied"
done

echo ""
echo "✓ All migrations complete!"
