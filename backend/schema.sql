-- ══════════════════════════════════════════════════════════════════════════════
-- PRATHAM RAIKAR PORTFOLIO — DATABASE SCHEMA
-- ══════════════════════════════════════════════════════════════════════════════
-- Supports both PostgreSQL and MySQL.
-- PostgreSQL: use SERIAL, JSONB, BOOLEAN, TEXT
-- MySQL:      replace SERIAL→INT AUTO_INCREMENT, JSONB→JSON, BOOLEAN→TINYINT(1)
-- ══════════════════════════════════════════════════════════════════════════════

-- ── 0. Create and select the database ────────────────────────────────────────
-- PostgreSQL:
-- CREATE DATABASE portfolio_db;
-- \c portfolio_db

-- MySQL:
-- CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE portfolio_db;

-- ══════════════════════════════════════════════════════════════════════════════
-- TABLE: admin_users
-- Stores the single admin account (Pratham).
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE admin_users (
    id               SERIAL PRIMARY KEY,
    email            VARCHAR(200) NOT NULL UNIQUE,
    password_hash    VARCHAR(512) NOT NULL,
    failed_attempts  INTEGER      DEFAULT 0,
    locked_until     TIMESTAMP    DEFAULT NULL,
    created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    last_login       TIMESTAMP    DEFAULT NULL
);

-- ══════════════════════════════════════════════════════════════════════════════
-- TABLE: about
-- Single-row table for Pratham's bio, contact info, and profile metadata.
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE about (
    id                SERIAL PRIMARY KEY,
    name              VARCHAR(100)  NOT NULL DEFAULT 'Pratham Raikar',
    tagline           VARCHAR(200)  DEFAULT 'AI-DS Engineer | Developer',
    bio               TEXT          NOT NULL,
    profile_photo_url VARCHAR(500)  DEFAULT NULL,
    resume_url        VARCHAR(500)  DEFAULT NULL,
    github_url        VARCHAR(500)  DEFAULT NULL,
    linkedin_url      VARCHAR(500)  DEFAULT NULL,
    email             VARCHAR(200)  DEFAULT NULL,
    phone             VARCHAR(50)   DEFAULT NULL,
    college           VARCHAR(300)  DEFAULT NULL,
    degree            VARCHAR(200)  DEFAULT NULL,
    year              VARCHAR(50)   DEFAULT NULL,
    specialization    VARCHAR(200)  DEFAULT NULL,
    updated_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ══════════════════════════════════════════════════════════════════════════════
-- TABLE: skill_categories
-- Groups skills into categories: Languages, AI/ML, Frontend, Backend, etc.
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE skill_categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    icon        VARCHAR(100) DEFAULT NULL,    -- FontAwesome / devicon CSS class
    order_index INTEGER      DEFAULT 0
);

-- ══════════════════════════════════════════════════════════════════════════════
-- TABLE: skills
-- Individual skills linked to a category, with proficiency score for charts.
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE skills (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    icon        VARCHAR(200) DEFAULT NULL,    -- devicon class or image URL
    category_id INTEGER      NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
    proficiency INTEGER      DEFAULT 70,      -- 0–100, used by Recharts bar/radar
    order_index INTEGER      DEFAULT 0
);

CREATE INDEX idx_skills_category ON skills(category_id);

-- ══════════════════════════════════════════════════════════════════════════════
-- TABLE: projects
-- Portfolio projects with tech stack tags, links, and feature flags.
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE projects (
    id            SERIAL PRIMARY KEY,
    title         VARCHAR(200)  NOT NULL,
    description   TEXT          NOT NULL,
    tech_tags     JSONB         DEFAULT '[]',  -- ["Python", "Flask", "MySQL"]
    github_url    VARCHAR(500)  DEFAULT NULL,
    live_url      VARCHAR(500)  DEFAULT NULL,
    thumbnail_url VARCHAR(500)  DEFAULT NULL,
    is_featured   BOOLEAN       DEFAULT FALSE,
    order_index   INTEGER       DEFAULT 0,
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to auto-update updated_at (PostgreSQL)
-- MySQL: use ON UPDATE CURRENT_TIMESTAMP on the column definition instead.
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ══════════════════════════════════════════════════════════════════════════════
-- TABLE: certificates
-- Certificates with image URL, issuer, date, and filter category.
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE certificates (
    id             SERIAL PRIMARY KEY,
    title          VARCHAR(200)  NOT NULL,
    issuer         VARCHAR(200)  DEFAULT NULL,
    issue_date     DATE          DEFAULT NULL,
    category       VARCHAR(50)   DEFAULT 'other',
                   -- ENUM values: 'ai', 'language', 'internship',
                   --              'training', 'workshop', 'other'
    image_url      VARCHAR(500)  DEFAULT NULL,
    credential_url VARCHAR(500)  DEFAULT NULL,
    created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_certificates_updated_at
BEFORE UPDATE ON certificates
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_certificates_category ON certificates(category);

-- ══════════════════════════════════════════════════════════════════════════════
-- TABLE: platforms
-- Competitive coding platform stats (LeetCode, HackerRank, CodeChef).
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE platforms (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100)  NOT NULL,
    description     TEXT          DEFAULT NULL,
    logo_url        VARCHAR(500)  DEFAULT NULL,
    profile_url     VARCHAR(500)  DEFAULT NULL,
    problems_solved VARCHAR(50)   DEFAULT NULL,  -- e.g. "130+"
    current_rating  VARCHAR(50)   DEFAULT NULL,  -- e.g. "1540" or "---"
    badges          JSONB         DEFAULT '[]',
    -- [{"label": "DCC August", "img": "/uploads/badges/leetcode_dccAugust.gif"}]
    stars           JSONB         DEFAULT '{}',
    -- {"Problem Solving": 2, "Java": 3}
    order_index     INTEGER       DEFAULT 0,
    updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_platforms_updated_at
BEFORE UPDATE ON platforms
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ══════════════════════════════════════════════════════════════════════════════
-- TABLE: internships
-- Work experience and internship timeline entries.
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE internships (
    id               SERIAL PRIMARY KEY,
    company_name     VARCHAR(200)  NOT NULL,
    role             VARCHAR(200)  NOT NULL,
    start_date       DATE          NOT NULL,
    end_date         DATE          DEFAULT NULL,   -- NULL if is_current = TRUE
    is_current       BOOLEAN       DEFAULT FALSE,
    description      TEXT          DEFAULT NULL,
    tech_used        JSONB         DEFAULT '[]',   -- ["Python", "AI", "Flask"]
    company_logo_url VARCHAR(500)  DEFAULT NULL,
    location         VARCHAR(200)  DEFAULT NULL,
    order_index      INTEGER       DEFAULT 0,
    created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ══════════════════════════════════════════════════════════════════════════════
-- TABLE: achievements
-- Highlight cards with metric counters (problems solved, certs, etc.).
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE achievements (
    id           SERIAL PRIMARY KEY,
    title        VARCHAR(200)  NOT NULL,
    description  TEXT          DEFAULT NULL,
    icon         VARCHAR(100)  DEFAULT NULL,   -- FontAwesome class: "fa-solid fa-code"
    metric_value VARCHAR(50)   DEFAULT NULL,   -- "130+", "7", "Top Participant"
    metric_label VARCHAR(100)  DEFAULT NULL,   -- "Problems Solved", "Projects"
    order_index  INTEGER       DEFAULT 0
);

-- ══════════════════════════════════════════════════════════════════════════════
-- TABLE: contact_messages
-- Stores all messages submitted via the public contact form.
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE contact_messages (
    id           SERIAL PRIMARY KEY,
    sender_name  VARCHAR(200)  NOT NULL,
    sender_email VARCHAR(200)  NOT NULL,
    subject      VARCHAR(300)  DEFAULT 'No subject',
    message      TEXT          NOT NULL,
    is_read      BOOLEAN       DEFAULT FALSE,
    received_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contact_messages_unread ON contact_messages(is_read);

-- ══════════════════════════════════════════════════════════════════════════════
-- SAMPLE SEED DATA (reference — use seed.py for full data)
-- ══════════════════════════════════════════════════════════════════════════════

-- Skill categories (abbreviated)
INSERT INTO skill_categories (name, icon, order_index) VALUES
  ('Languages',      'fa-solid fa-code',               0),
  ('AI / ML',        'fa-solid fa-brain',              1),
  ('Frontend',       'fa-solid fa-laptop-code',        2),
  ('Backend',        'fa-solid fa-server',             3),
  ('Database & Cloud','fa-solid fa-database',          4),
  ('Tools & IDEs',   'fa-solid fa-screwdriver-wrench', 5);

-- Sample platform (LeetCode)
INSERT INTO platforms (name, description, profile_url, problems_solved, current_rating, order_index) VALUES
  ('LeetCode',  'Platform for problem solving and competitive programming.',
   'https://leetcode.com/u/Pratham_R/', '130+', '---', 0),
  ('HackerRank','Improving coding and algorithmic skills through challenges.',
   'https://www.hackerrank.com/profile/raikarpratham3', '---', '---', 1),
  ('CodeChef',  'Participating in coding contests and improving rankings.',
   'https://www.codechef.com/users/pratham_raikar', '---', '---', 2);

-- ══════════════════════════════════════════════════════════════════════════════
-- MySQL VARIANT (comment out PostgreSQL sections above, uncomment these)
-- ══════════════════════════════════════════════════════════════════════════════
-- Replace in all tables:
--   SERIAL            → INT AUTO_INCREMENT
--   JSONB             → JSON
--   BOOLEAN           → TINYINT(1)
--   TEXT              → TEXT (same)
--   CURRENT_TIMESTAMP → CURRENT_TIMESTAMP (same)
--
-- Remove all CREATE TRIGGER / CREATE FUNCTION blocks (use application-layer updates).
-- Add to projects, certificates, platforms:
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- ══════════════════════════════════════════════════════════════════════════════
