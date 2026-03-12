#!/bin/bash
# ============================================
# StellarIDE — Dev Environment Start Script
# Starts all services for local development
# ============================================

set -euo pipefail

echo "╔══════════════════════════════════════╗"
echo "║     StellarIDE — Dev Environment     ║"
echo "╚══════════════════════════════════════╝"

# ── Check .env exists ─────────────────────────
if [ ! -f .env ]; then
    echo "✗ .env file not found!"
    echo "  Run ./scripts/setup.sh first"
    exit 1
fi

# ── Start all services ────────────────────────
echo ""
echo "▶ Starting all services..."
docker-compose up -d

# ── Wait for postgres to be ready ────────────
echo ""
echo "▶ Waiting for PostgreSQL to be ready..."
until docker-compose exec -T postgres \
    pg_isready -U stellar 2>/dev/null; do
    echo "  ... waiting"
    sleep 2
done
echo "  ✓ PostgreSQL is ready"

# ── Run migrations ────────────────────────────
echo ""
echo "▶ Running database migrations..."
./scripts/migrate.sh

# ── Show service status ───────────────────────
echo ""
echo "▶ Service status:"
docker-compose ps

# ── Done ─────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════╗"
echo "║       StellarIDE is running! ✓       ║"
echo "║                                      ║"
echo "║  Frontend  → http://localhost:3000   ║"
echo "║  Backend   → http://localhost:8080   ║"
echo "║  Postgres  → localhost:5432          ║"
echo "╚══════════════════════════════════════╝"
