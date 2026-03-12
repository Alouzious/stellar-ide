-- ============================================
-- Migration 002 — Create Projects Table
-- ============================================

CREATE TABLE IF NOT EXISTS projects (
    id          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        TEXT      NOT NULL,
    description TEXT,
    files       JSONB     NOT NULL DEFAULT '{}',
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id
    ON projects(user_id);

CREATE INDEX IF NOT EXISTS idx_projects_updated_at
    ON projects(updated_at DESC);
