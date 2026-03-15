# FilmLink — Database Schema

Built with **Prisma ORM** + **PostgreSQL**.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set your database URL
cp .env.example .env
# edit .env → DATABASE_URL="postgresql://user:pass@localhost:5432/filmlink"

# 3. Run the migration
npx prisma migrate dev --name init

# 4. Seed development data
npx prisma db seed

# 5. Open Prisma Studio (visual DB browser)
npx prisma studio
```

## File Structure

```
prisma/
  schema.prisma           ← Single source of truth for all models
  seed.ts                 ← Dev seed data (4 users, 1 project, 1 event, etc.)
  migrations/
    001_init.sql          ← Raw SQL migration (can apply directly via psql)
```

---

## Schema Overview

### Core Tables

| Table              | Purpose                                              |
|--------------------|------------------------------------------------------|
| `users`            | Auth + account info for all user types               |
| `profiles`         | Public-facing creative profiles (1:1 with users)    |
| `profile_skills`   | Skill tags attached to a profile                     |
| `credits`          | Filmography / work history entries                   |
| `portfolio_items`  | Media portfolio (images, video, PDFs)                |
| `follows`          | Bidirectional follow graph between users             |
| `projects`         | Project listings (short films, music videos, etc.)  |
| `roles`            | Individual roles/positions within a project          |
| `applications`     | Role applications submitted by creatives             |
| `events`           | Mixers, screenings, workshops, panels                |
| `event_attendees`  | RSVPs + check-in tracking                            |
| `articles`         | Editorial content (news, interviews, coverage)       |
| `acting_classes`   | Partner acting school / class listings               |
| `class_reviews`    | Member ratings & reviews of acting classes           |
| `notifications`    | In-app notifications for all user types              |
| `admin_logs`       | Audit trail for all admin actions                    |

---

## User Types & Flow

```
FAN         →  No approval needed. Can read, RSVP, follow.
CREATIVE    →  Submits application → Admin approves → Full access.
ADMIN       →  Manages all content, users, applications.
```

### Creative Application Flow

1. User signs up → `user_type = CREATIVE`, `status = PENDING`
2. Submits profile (headshot, reel, bio) → Profile record created
3. Admin reviews in dashboard → updates `status = APPROVED | REJECTED`
4. Approved creatives can post projects, apply to roles, etc.

---

## Key Design Decisions

### IDs
Using `cuid()` (collision-resistant, URL-safe) instead of integer sequences for all primary keys. Easier to work with in distributed environments and safe to expose in URLs.

### Arrays
PostgreSQL native `TEXT[]` arrays for `tags` on projects, events, and articles. Simple and fast for filtering — avoids a join table for these low-cardinality values.

### Denormalized Counts
`follower_count`, `following_count`, `application_count`, `registered_count`, `review_count` are stored on parent rows. Update these with DB triggers or application-level logic on write. Avoids expensive COUNT queries on hot paths.

### updated_at Triggers
A single `set_updated_at()` trigger function is attached to all tables with `updated_at`. No need to manage this in application code.

### Soft vs Hard Deletes
Currently uses hard deletes (CASCADE). For production, consider adding `deleted_at TIMESTAMPTZ` columns to `users`, `projects`, and `applications` to support recovery and audit trails.

---

## Indexes

All foreign keys are indexed. Additional indexes cover:
- Composite `(status, published_at)` for feed queries on projects and articles
- `(user_id, is_read)` for notification badge counts
- `(project_id, status)` for application review workflows
- `(profession, is_filled)` for role search filtering

---

## Environment Variables

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/filmlink?schema=public"
```

---

## Adding a Migration

```bash
# After editing schema.prisma:
npx prisma migrate dev --name describe_your_change

# Example:
npx prisma migrate dev --name add_messaging_tables
```

Prisma tracks migration history in the `_prisma_migrations` table automatically.
