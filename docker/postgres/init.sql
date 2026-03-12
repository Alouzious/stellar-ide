-- ============================================
-- StellarIDE — PostgreSQL Initialization
-- Runs automatically when container first starts
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Users Table ──────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT        UNIQUE,
    github_id     TEXT        UNIQUE,
    github_login  TEXT,
    avatar_url    TEXT,
    display_name  TEXT,
    created_at    TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_github_id
    ON users(github_id);

CREATE INDEX IF NOT EXISTS idx_users_email
    ON users(email);

-- ── Projects Table ────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        TEXT        NOT NULL,
    description TEXT,
    files       JSONB       NOT NULL DEFAULT '{}',
    created_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id
    ON projects(user_id);

-- ── Deployments Table ─────────────────────────
CREATE TABLE IF NOT EXISTS deployments (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id    UUID        REFERENCES projects(id) ON DELETE SET NULL,
    contract_id   TEXT,
    network       TEXT        NOT NULL,
    status        TEXT        NOT NULL DEFAULT 'pending',
    tx_hash       TEXT,
    error_message TEXT,
    deployed_at   TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deployments_user_id
    ON deployments(user_id);

CREATE INDEX IF NOT EXISTS idx_deployments_contract_id
    ON deployments(contract_id);

-- ── Artifacts Table ───────────────────────────
CREATE TABLE IF NOT EXISTS artifacts (
    id                UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    deployment_id     UUID      NOT NULL REFERENCES deployments(id) ON DELETE CASCADE,
    user_id           UUID      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contract_id       TEXT      NOT NULL,
    network           TEXT      NOT NULL,
    abi_json          JSONB,
    typescript_client TEXT,
    react_example     TEXT,
    zip_data          BYTEA,
    created_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_artifacts_deployment_id
    ON artifacts(deployment_id);

CREATE INDEX IF NOT EXISTS idx_artifacts_user_id
    ON artifacts(user_id);
