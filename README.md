# StellarIDE

> Browser-based Soroban smart contract development environment.
> Write, test, audit, deploy, and integrate Soroban contracts —
> entirely in the browser. No local Rust or Stellar CLI needed.

---

## Features

- ✅ Multi-file Monaco editor with Rust syntax highlighting
- ✅ Docker sandbox compilation and testing
- ✅ Integrated Scout Security Audit
- ✅ One-click deploy to Testnet and Mainnet
- ✅ Full wallet integration (Freighter, xBull, Albedo)
- ✅ Deployment Artifacts Package (Contract ID + ABI + TypeScript)
- ✅ Live collaboration — real-time multi-user editing
- ✅ Cloud code persistence — access from any device
- ✅ User accounts and deployment history

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Tailwind CSS + Vite |
| Backend | Rust + Axum |
| Database | PostgreSQL (SQLx) |
| Cache | Redis |
| Sandbox | Docker (wasm_sandbox image) |
| Blockchain | Stellar / Soroban |

---

## Project Structure

```
stellar-ide/
├── frontend/          ← React + TypeScript + Tailwind
├── backend/           ← Rust + Axum API server
├── sandbox/           ← Docker sandbox image + templates
├── docker/            ← All Dockerfiles + nginx config
├── migrations/        ← PostgreSQL migration files
├── scripts/           ← Dev and deploy helper scripts
├── docker-compose.yml
├── docker-compose.prod.yml
└── .env.example
```

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Alouzious/stellar-ide.git
cd stellar-ide
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your values
nano .env
```

### 3. Build the sandbox Docker image

```bash
docker volume create cargo-cache
docker build -f docker/Dockerfile.sandbox -t wasm_sandbox .
```

### 4. Start all services

```bash
docker-compose up --build
```

### 5. Open in browser

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

---

## Development

### Backend only (Rust + Axum)

```bash
cd backend
cargo run
```

### Frontend only (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

### Run migrations

```bash
cd backend
cargo sqlx migrate run
```

---

## Environment Variables

See `.env.example` for all required variables.

---

## License

MIT License — see LICENSE file for details.