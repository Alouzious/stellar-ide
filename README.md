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

In docker-compose + nginx mode, **all services are accessed through nginx on port 80**:

| Service | URL |
|---|---|
| App (via nginx) | http://localhost |
| Backend API (direct) | http://localhost:8080 |
| Frontend (direct) | http://localhost:3000 |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

> **Note:** When using nginx mode (`docker-compose up`), leave `VITE_API_URL` empty/unset.
> The frontend defaults to same-origin `/api/v1` which nginx proxies to the backend.
> Only set `VITE_API_URL=http://localhost:8080` when running the frontend directly without nginx.

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

### Key variables for docker-compose + nginx mode

| Variable | Default | Description |
|---|---|---|
| `FRONTEND_PUBLIC_URL` | `http://localhost` | Public URL used for OAuth callback redirect. Set to your domain in production. |
| `VITE_API_URL` | _(empty)_ | API base URL override. Leave empty for nginx mode (same-origin). Set to `http://localhost:8080` for standalone dev. |
| `VITE_WS_URL` | _(empty)_ | WebSocket base URL override. Leave empty for nginx mode. |
| `GITHUB_CLIENT_ID` | _(required)_ | GitHub OAuth App client ID. |
| `GITHUB_CLIENT_SECRET` | _(required)_ | GitHub OAuth App client secret. |
| `GITHUB_REDIRECT_URL` | `http://localhost:8080/api/v1/auth/github/callback` | GitHub OAuth callback URL (backend-facing). |

---

## License

MIT License — see LICENSE file for details.