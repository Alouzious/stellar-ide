-- ============================================
-- Migration 001 — Create Users Table
-- ============================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id            UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT      UNIQUE,
    github_id     TEXT      UNIQUE NOT NULL,
    github_login  TEXT      NOT NULL,
    avatar_url    TEXT,
    display_name  TEXT,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_github_id
    ON users(github_id);

CREATE INDEX IF NOT EXISTS idx_users_email
    ON users(email);
