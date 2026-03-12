#!/bin/bash
# ============================================
# StellarIDE — Database Reset Script
# ⚠ WARNING: Destroys ALL data in the DB!
# For development use only!
# ============================================

set -euo pipefail

echo "╔══════════════════════════════════════╗"
echo "║  ⚠  StellarIDE — DB Reset Script    ║"
echo "║     THIS WILL DESTROY ALL DATA!      ║"
echo "╚══════════════════════════════════════╝"
echo ""

# ── Safety confirmation ───────────────────────
read -r -p "Are you sure? Type YES to continue: " confirm
if [ "${confirm}" != "YES" ]; then
    echo "Aborted."
    exit 0
fi

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

# ── Drop and recreate database ────────────────
echo ""
echo "▶ Dropping database ${DB_NAME}..."
psql \
    -h "${DB_HOST}" \
    -p "${DB_PORT}" \
    -U "${DB_USER}" \
    -d postgres \
    -c "DROP DATABASE IF EXISTS ${DB_NAME};" \
    2>&1

echo "▶ Recreating database ${DB_NAME}..."
psql \
    -h "${DB_HOST}" \
    -p "${DB_PORT}" \
    -U "${DB_USER}" \
    -d postgres \
    -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};" \
    2>&1

echo "  ✓ Database recreated"

# ── Re-run all migrations ─────────────────────
echo ""
echo "▶ Re-running all migrations..."
./scripts/migrate.sh

echo ""
echo "╔══════════════════════════════════════╗"
echo "║       Database reset complete! ✓     ║"
echo "╚══════════════════════════════════════╝"
