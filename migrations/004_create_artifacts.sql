-- ============================================
-- Migration 004 — Create Artifacts Table
-- ============================================

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

CREATE INDEX IF NOT EXISTS idx_artifacts_contract_id
    ON artifacts(contract_id);
