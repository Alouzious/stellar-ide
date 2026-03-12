#!/bin/bash
# ============================================
# StellarIDE — First-Time Setup Script
# Run this once after cloning the repo
# ============================================

set -euo pipefail

echo "╔══════════════════════════════════════╗"
echo "║     StellarIDE — Setup Script        ║"
echo "╚══════════════════════════════════════╝"

# ── Check required tools ──────────────────────
echo ""
echo "▶ Checking required tools..."

for tool in docker docker-compose rustup cargo node npm; do
    if command -v "$tool" &>/dev/null; then
        echo "  ✓ $tool found"
    else
        echo "  ✗ $tool not found — please install it first"
        exit 1
    fi
done

# ── Copy .env if missing ──────────────────────
echo ""
echo "▶ Setting up environment..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo "  ✓ Created .env from .env.example"
    echo "  ⚠ Edit .env and set your secrets before continuing!"
else
    echo "  ✓ .env already exists"
fi

# ── Build Docker images ───────────────────────
echo ""
echo "▶ Building Docker images..."

docker build \
    -f docker/Dockerfile.sandbox \
    -t wasm_sandbox:latest \
    . && echo "  ✓ wasm_sandbox image built"

docker-compose build && echo "  ✓ All services built"

# ── Install frontend dependencies ────────────
echo ""
echo "▶ Installing frontend dependencies..."
cd frontend && npm install && cd ..
echo "  ✓ Frontend dependencies installed"

# ── Done ─────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════╗"
echo "║         Setup Complete! ✓            ║"
echo "║  Run ./scripts/dev.sh to start       ║"
echo "╚══════════════════════════════════════╝"
