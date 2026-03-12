-- ============================================
-- Migration 003 — Create Deployments Table
-- ============================================

CREATE TABLE IF NOT EXISTS deployments (
    id            UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id    UUID      REFERENCES projects(id) ON DELETE SET NULL,
    contract_id   TEXT,
    network       TEXT      NOT NULL,
    status        TEXT      NOT NULL DEFAULT 'pending',
    tx_hash       TEXT,
    error_message TEXT,
    deployed_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deployments_user_id
    ON deployments(user_id);

CREATE INDEX IF NOT EXISTS idx_deployments_project_id
    ON deployments(project_id);

CREATE INDEX IF NOT EXISTS idx_deployments_contract_id
    ON deployments(contract_id);

CREATE INDEX IF NOT EXISTS idx_deployments_network
    ON deployments(network);

CREATE INDEX IF NOT EXISTS idx_deployments_deployed_at
    ON deployments(deployed_at DESC);
