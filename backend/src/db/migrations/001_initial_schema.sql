-- FilmLink Initial Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('fan', 'creative', 'admin');
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE compensation_type AS ENUM ('paid', 'unpaid', 'deferred');

CREATE TABLE users (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email        TEXT UNIQUE NOT NULL,
  password     TEXT NOT NULL,
  role         user_role NOT NULL DEFAULT 'fan',
  status       application_status DEFAULT 'pending',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  name         TEXT,
  headshot_url TEXT,
  location     TEXT,
  profession   TEXT,
  bio          TEXT,
  reel_url     TEXT,
  resume_url   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE projects (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  compensation compensation_type DEFAULT 'unpaid',
  location     TEXT,
  shoot_dates  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE project_roles (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id   UUID REFERENCES projects(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT
);

CREATE TABLE followers (
  follower_id  UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE events (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  description  TEXT,
  event_date   TIMESTAMPTZ,
  location     TEXT,
  ticket_url   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE articles (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id    UUID REFERENCES users(id),
  title        TEXT NOT NULL,
  body         TEXT,
  published    BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
