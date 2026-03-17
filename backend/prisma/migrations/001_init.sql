-- ============================================================
-- FilmLink — Initial Migration
-- Generated from prisma/schema.prisma
-- Run: npx prisma migrate dev --name init
-- Or apply directly: psql $DATABASE_URL -f migrations/001_init.sql
-- ============================================================

-- ─────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────

CREATE TYPE "UserType"          AS ENUM ('CREATIVE', 'FAN', 'ADMIN');
CREATE TYPE "UserStatus"        AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');
CREATE TYPE "Profession"        AS ENUM ('ACTOR', 'WRITER', 'DIRECTOR', 'PRODUCER', 'CINEMATOGRAPHER', 'EDITOR', 'COMPOSER', 'OTHER');
CREATE TYPE "ProjectType"       AS ENUM ('SHORT_FILM', 'FEATURE_FILM', 'MUSIC_VIDEO', 'STUDENT_FILM', 'WEB_SERIES', 'DOCUMENTARY', 'OTHER');
CREATE TYPE "CompensationType"  AS ENUM ('PAID', 'UNPAID', 'DEFERRED', 'COPY_CREDIT_MEALS');
CREATE TYPE "ProjectStatus"     AS ENUM ('DRAFT', 'OPEN', 'FILLED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "ApplicationStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');
CREATE TYPE "EventType"         AS ENUM ('MIXER', 'SCREENING', 'PANEL', 'WORKSHOP', 'SPEAKER', 'OTHER');
CREATE TYPE "EventStatus"       AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED');
CREATE TYPE "ArticleStatus"     AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "MembershipTier"    AS ENUM ('FREE', 'PREMIUM');

-- ─────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────

CREATE TABLE "users" (
  "id"                   TEXT         PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "email"                TEXT         NOT NULL UNIQUE,
  "password_hash"        TEXT         NOT NULL,
  "user_type"            "UserType"   NOT NULL DEFAULT 'FAN',
  "status"               "UserStatus" NOT NULL DEFAULT 'PENDING',
  "membership_tier"      "MembershipTier" NOT NULL DEFAULT 'FREE',
  "membership_expiry"    TIMESTAMPTZ,
  "email_verified"       BOOLEAN      NOT NULL DEFAULT FALSE,
  "email_verify_token"   TEXT,
  "reset_password_token" TEXT,
  "reset_password_expiry" TIMESTAMPTZ,
  "created_at"           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "updated_at"           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "last_login_at"        TIMESTAMPTZ
);

CREATE INDEX "idx_users_email"           ON "users" ("email");
CREATE INDEX "idx_users_type_status"     ON "users" ("user_type", "status");

-- ─────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────

CREATE TABLE "profiles" (
  "id"              TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "user_id"         TEXT        NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
  "first_name"      TEXT        NOT NULL,
  "last_name"       TEXT        NOT NULL,
  "display_name"    TEXT,
  "profession"      "Profession",
  "bio"             TEXT,
  "location"        TEXT,
  "city"            TEXT,
  "state"           TEXT,
  "country"         TEXT        NOT NULL DEFAULT 'US',

  -- Media
  "headshot"        TEXT,
  "reel_url"        TEXT,
  "resume_url"      TEXT,
  "portfolio_url"   TEXT,

  -- Social links
  "imdb_url"        TEXT,
  "instagram_url"   TEXT,
  "twitter_url"     TEXT,
  "website_url"     TEXT,
  "linkedin_url"    TEXT,

  -- Stats
  "follower_count"  INTEGER     NOT NULL DEFAULT 0,
  "following_count" INTEGER     NOT NULL DEFAULT 0,

  "is_public"       BOOLEAN     NOT NULL DEFAULT TRUE,
  "is_featured"     BOOLEAN     NOT NULL DEFAULT FALSE,
  "created_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "idx_profiles_profession"  ON "profiles" ("profession");
CREATE INDEX "idx_profiles_location"    ON "profiles" ("location");
CREATE INDEX "idx_profiles_featured"    ON "profiles" ("is_featured");

CREATE TABLE "profile_skills" (
  "id"          TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "profile_id"  TEXT        NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
  "skill"       TEXT        NOT NULL,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE ("profile_id", "skill")
);

CREATE TABLE "credits" (
  "id"          TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "profile_id"  TEXT        NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
  "title"       TEXT        NOT NULL,
  "role"        TEXT        NOT NULL,
  "year"        INTEGER,
  "type"        TEXT,
  "director"    TEXT,
  "notes"       TEXT,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "idx_credits_profile" ON "credits" ("profile_id");

CREATE TABLE "portfolio_items" (
  "id"          TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "profile_id"  TEXT        NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
  "title"       TEXT        NOT NULL,
  "description" TEXT,
  "media_url"   TEXT        NOT NULL,
  "media_type"  TEXT        NOT NULL, -- 'image' | 'video' | 'pdf'
  "sort_order"  INTEGER     NOT NULL DEFAULT 0,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "idx_portfolio_profile" ON "portfolio_items" ("profile_id");

-- ─────────────────────────────────────────
-- FOLLOWS
-- ─────────────────────────────────────────

CREATE TABLE "follows" (
  "id"           TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "follower_id"  TEXT        NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "following_id" TEXT        NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "created_at"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE ("follower_id", "following_id")
);

CREATE INDEX "idx_follows_following" ON "follows" ("following_id");
CREATE INDEX "idx_follows_follower"  ON "follows" ("follower_id");

-- ─────────────────────────────────────────
-- PROJECTS
-- ─────────────────────────────────────────

CREATE TABLE "projects" (
  "id"                    TEXT             PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "poster_id"             TEXT             NOT NULL REFERENCES "users"("id"),
  "title"                 TEXT             NOT NULL,
  "description"           TEXT             NOT NULL,
  "project_type"          "ProjectType"    NOT NULL,
  "genre"                 TEXT,
  "status"                "ProjectStatus"  NOT NULL DEFAULT 'DRAFT',
  "is_featured"           BOOLEAN          NOT NULL DEFAULT FALSE,
  "location"              TEXT,
  "city"                  TEXT,
  "state"                 TEXT,
  "is_remote"             BOOLEAN          NOT NULL DEFAULT FALSE,
  "shoot_start_date"      TIMESTAMPTZ,
  "shoot_end_date"        TIMESTAMPTZ,
  "audition_date"         TIMESTAMPTZ,
  "audition_instructions" TEXT,
  "poster_url"            TEXT,
  "website"               TEXT,
  "tags"                  TEXT[]           NOT NULL DEFAULT '{}',
  "view_count"            INTEGER          NOT NULL DEFAULT 0,
  "application_count"     INTEGER          NOT NULL DEFAULT 0,
  "created_at"            TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  "updated_at"            TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  "published_at"          TIMESTAMPTZ
);

CREATE INDEX "idx_projects_status_published"  ON "projects" ("status", "published_at");
CREATE INDEX "idx_projects_type"              ON "projects" ("project_type");
CREATE INDEX "idx_projects_poster"            ON "projects" ("poster_id");
CREATE INDEX "idx_projects_featured"          ON "projects" ("is_featured");

-- ─────────────────────────────────────────
-- ROLES
-- ─────────────────────────────────────────

CREATE TABLE "roles" (
  "id"                   TEXT                NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "project_id"           TEXT                NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
  "title"                TEXT                NOT NULL,
  "profession"           "Profession"        NOT NULL,
  "description"          TEXT,
  "compensation"         "CompensationType"  NOT NULL,
  "compensation_details" TEXT,
  "age_range"            TEXT,
  "gender"               TEXT,
  "ethnicity"            TEXT,
  "is_filled"            BOOLEAN             NOT NULL DEFAULT FALSE,
  "created_at"           TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  "updated_at"           TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX "idx_roles_project"           ON "roles" ("project_id");
CREATE INDEX "idx_roles_profession_filled" ON "roles" ("profession", "is_filled");

-- ─────────────────────────────────────────
-- APPLICATIONS
-- ─────────────────────────────────────────

CREATE TABLE "applications" (
  "id"               TEXT                NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "applicant_id"     TEXT                NOT NULL REFERENCES "users"("id"),
  "project_id"       TEXT                NOT NULL REFERENCES "projects"("id"),
  "role_id"          TEXT                NOT NULL REFERENCES "roles"("id"),
  "status"           "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
  "cover_letter"     TEXT,
  "audition_tape_url" TEXT,
  "additional_links" TEXT[]              NOT NULL DEFAULT '{}',
  "producer_notes"   TEXT,
  "reviewed_at"      TIMESTAMPTZ,
  "reviewed_by"      TEXT,
  "created_at"       TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  "updated_at"       TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  UNIQUE ("applicant_id", "role_id")
);

CREATE INDEX "idx_applications_project_status" ON "applications" ("project_id", "status");
CREATE INDEX "idx_applications_applicant"      ON "applications" ("applicant_id");
CREATE INDEX "idx_applications_role"           ON "applications" ("role_id");

-- ─────────────────────────────────────────
-- EVENTS
-- ─────────────────────────────────────────

CREATE TABLE "events" (
  "id"                TEXT          NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "title"             TEXT          NOT NULL,
  "description"       TEXT          NOT NULL,
  "event_type"        "EventType"   NOT NULL,
  "status"            "EventStatus" NOT NULL DEFAULT 'DRAFT',
  "venue"             TEXT,
  "address"           TEXT,
  "city"              TEXT,
  "state"             TEXT,
  "is_virtual"        BOOLEAN       NOT NULL DEFAULT FALSE,
  "virtual_url"       TEXT,
  "start_date"        TIMESTAMPTZ   NOT NULL,
  "end_date"          TIMESTAMPTZ,
  "doors_open"        TIMESTAMPTZ,
  "is_free"           BOOLEAN       NOT NULL DEFAULT TRUE,
  "ticket_price"      NUMERIC(10,2),
  "ticket_url"        TEXT,
  "capacity"          INTEGER,
  "registered_count"  INTEGER       NOT NULL DEFAULT 0,
  "cover_image_url"   TEXT,
  "tags"              TEXT[]        NOT NULL DEFAULT '{}',
  "created_by_id"     TEXT          NOT NULL,
  "is_featured"       BOOLEAN       NOT NULL DEFAULT FALSE,
  "created_at"        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updated_at"        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "published_at"      TIMESTAMPTZ
);

CREATE INDEX "idx_events_status_date"  ON "events" ("status", "start_date");
CREATE INDEX "idx_events_type"         ON "events" ("event_type");
CREATE INDEX "idx_events_featured"     ON "events" ("is_featured");

CREATE TABLE "event_attendees" (
  "id"            TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "event_id"      TEXT        NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
  "user_id"       TEXT        NOT NULL REFERENCES "users"("id"),
  "ticket_ref"    TEXT,
  "checked_in"    BOOLEAN     NOT NULL DEFAULT FALSE,
  "checked_in_at" TIMESTAMPTZ,
  "created_at"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE ("event_id", "user_id")
);

CREATE INDEX "idx_attendees_event" ON "event_attendees" ("event_id");
CREATE INDEX "idx_attendees_user"  ON "event_attendees" ("user_id");

-- ─────────────────────────────────────────
-- ARTICLES
-- ─────────────────────────────────────────

CREATE TABLE "articles" (
  "id"              TEXT            NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "author_id"       TEXT            NOT NULL REFERENCES "users"("id"),
  "title"           TEXT            NOT NULL,
  "slug"            TEXT            NOT NULL UNIQUE,
  "summary"         TEXT,
  "body"            TEXT            NOT NULL,
  "cover_image_url" TEXT,
  "status"          "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
  "category"        TEXT,
  "tags"            TEXT[]          NOT NULL DEFAULT '{}',
  "is_sponsored"    BOOLEAN         NOT NULL DEFAULT FALSE,
  "sponsor_name"    TEXT,
  "view_count"      INTEGER         NOT NULL DEFAULT 0,
  "is_featured"     BOOLEAN         NOT NULL DEFAULT FALSE,
  "created_at"      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  "updated_at"      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  "published_at"    TIMESTAMPTZ
);

CREATE INDEX "idx_articles_status_published" ON "articles" ("status", "published_at");
CREATE INDEX "idx_articles_slug"             ON "articles" ("slug");
CREATE INDEX "idx_articles_category"         ON "articles" ("category");
CREATE INDEX "idx_articles_featured"         ON "articles" ("is_featured");

-- ─────────────────────────────────────────
-- ACTING CLASSES
-- ─────────────────────────────────────────

CREATE TABLE "acting_classes" (
  "id"                  TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "title"               TEXT        NOT NULL,
  "instructor"          TEXT        NOT NULL,
  "school"              TEXT,
  "description"         TEXT,
  "website"             TEXT,
  "schedule"            TEXT,
  "is_online"           BOOLEAN     NOT NULL DEFAULT FALSE,
  "location"            TEXT,
  "city"                TEXT,
  "state"               TEXT,
  "price"               NUMERIC(10,2),
  "price_description"   TEXT,
  "is_active"           BOOLEAN     NOT NULL DEFAULT TRUE,
  "is_featured"         BOOLEAN     NOT NULL DEFAULT FALSE,
  "is_verified_partner" BOOLEAN     NOT NULL DEFAULT FALSE,
  "avg_rating"          NUMERIC(3,2),
  "review_count"        INTEGER     NOT NULL DEFAULT 0,
  "created_at"          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at"          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "idx_classes_active_featured" ON "acting_classes" ("is_active", "is_featured");
CREATE INDEX "idx_classes_city"            ON "acting_classes" ("city");

CREATE TABLE "class_reviews" (
  "id"          TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "class_id"    TEXT        NOT NULL REFERENCES "acting_classes"("id") ON DELETE CASCADE,
  "user_id"     TEXT        NOT NULL REFERENCES "users"("id"),
  "rating"      INTEGER     NOT NULL CHECK ("rating" BETWEEN 1 AND 5),
  "body"        TEXT,
  "is_verified" BOOLEAN     NOT NULL DEFAULT FALSE,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE ("class_id", "user_id")
);

CREATE INDEX "idx_reviews_class" ON "class_reviews" ("class_id");

-- ─────────────────────────────────────────
-- NOTIFICATIONS
-- ─────────────────────────────────────────

CREATE TABLE "notifications" (
  "id"          TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "user_id"     TEXT        NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "type"        TEXT        NOT NULL,
  "title"       TEXT        NOT NULL,
  "body"        TEXT,
  "link_url"    TEXT,
  "is_read"     BOOLEAN     NOT NULL DEFAULT FALSE,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "idx_notifications_user_read" ON "notifications" ("user_id", "is_read");
CREATE INDEX "idx_notifications_created"   ON "notifications" ("created_at");

-- ─────────────────────────────────────────
-- ADMIN LOG
-- ─────────────────────────────────────────

CREATE TABLE "admin_logs" (
  "id"          TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "admin_id"    TEXT        NOT NULL REFERENCES "users"("id"),
  "action"      TEXT        NOT NULL,
  "target_type" TEXT        NOT NULL,
  "target_id"   TEXT        NOT NULL,
  "notes"       TEXT,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "idx_admin_logs_admin"  ON "admin_logs" ("admin_id");
CREATE INDEX "idx_admin_logs_target" ON "admin_logs" ("target_type", "target_id");

-- ─────────────────────────────────────────
-- UPDATED_AT TRIGGER FUNCTION
-- ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to all tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'users', 'profiles', 'projects', 'roles',
    'applications', 'events', 'articles',
    'acting_classes', 'class_reviews'
  ]
  LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated_at
       BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION set_updated_at();',
      t, t
    );
  END LOOP;
END;
$$;
