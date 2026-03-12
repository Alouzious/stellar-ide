-- ============================================
-- Migration 005 — Create Sessions Table
-- Tracks active user sessions and collab rooms
-- ============================================

CREATE TABLE IF NOT EXISTS sessions (
    id            UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash    TEXT      NOT NULL UNIQUE,
    ip_address    TEXT,
    user_agent    TEXT,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at    TIMESTAMP NOT NULL,
    last_seen_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id
    ON sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_sessions_token_hash
    ON sessions(token_hash);

CREATE INDEX IF NOT EXISTS idx_sessions_expires_at
    ON sessions(expires_at);

-- ── Collaboration Rooms Table ─────────────────
-- Tracks live collaboration sessions per project
CREATE TABLE IF NOT EXISTS collab_rooms (
    id          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  UUID      NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    created_by  UUID      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invite_code TEXT      NOT NULL UNIQUE,
    is_active   BOOLEAN   NOT NULL DEFAULT true,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    closed_at   TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_collab_rooms_project_id
    ON collab_rooms(project_id);

CREATE INDEX IF NOT EXISTS idx_collab_rooms_invite_code
    ON collab_rooms(invite_code);
