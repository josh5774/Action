# FilmLink — Backend API

Node.js / Express / PostgreSQL backend for the FilmLink platform.

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Edit .env and fill in DATABASE_URL and JWT_SECRET
```

### 3. Provision a free Postgres database

**Option A — Supabase (recommended)**
1. Create a free project at https://supabase.com
2. Go to **Settings → Database → Connection string → URI**
3. Copy the URI and paste it as `DATABASE_URL` in your `.env`

**Option B — Railway**
1. Create a free project at https://railway.app
2. Add a **PostgreSQL** service
3. Click the service → **Connect** → copy the `DATABASE_URL`
4. Paste it in your `.env`

### 4. Run migrations
```bash
npm run migrate
```
This applies `db/migrations/001_initial_schema.sql` and tracks it in a `_migrations` table.

### 5. Start the dev server
```bash
npm run dev        # nodemon — auto-restarts on changes
# or
npm start          # plain node
```

The API will be available at **http://localhost:3000**.
Health check: `GET /health`

---

## Project Structure

```
filmlink-backend/
├── server.js                   # Express app entry point
├── config/
│   └── db.js                   # PostgreSQL connection pool
├── routes/                     # Express routers (URL → controller)
│   ├── auth.js
│   ├── users.js
│   ├── projects.js
│   ├── applications.js
│   ├── events.js
│   ├── articles.js
│   ├── classes.js
│   └── admin.js
├── controllers/                # Request handlers (business logic)
│   ├── authController.js
│   ├── usersController.js
│   ├── projectsController.js
│   ├── eventsController.js
│   ├── articlesController.js
│   └── adminController.js
├── middleware/
│   ├── auth.js                 # JWT verification, role guards
│   ├── validate.js             # express-validator error formatter
│   └── errorHandler.js        # Central error + 404 handler
└── db/
    ├── migrate.js              # Migration runner script
    └── migrations/
        └── 001_initial_schema.sql
```

---

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login, receive JWT |
| GET | `/api/auth/me` | ✓ | Current user info |
| GET | `/api/users/:id/profile` | — | View creative profile |
| PUT | `/api/users/me/profile` | Creative | Update own profile |
| POST | `/api/users/:id/follow` | ✓ | Follow a user |
| DELETE | `/api/users/:id/follow` | ✓ | Unfollow a user |
| GET | `/api/projects` | — | List/filter projects |
| GET | `/api/projects/:id` | — | Project + roles detail |
| POST | `/api/projects` | Creative | Create project |
| POST | `/api/projects/roles/:roleId/apply` | Creative | Apply to a role |
| POST | `/api/applications` | ✓ | Submit creator application |
| GET | `/api/applications/me` | ✓ | Check application status |
| GET | `/api/events` | — | Upcoming events |
| POST | `/api/events/:id/rsvp` | ✓ | RSVP to event |
| GET | `/api/articles` | — | Published articles |
| GET | `/api/articles/:slug` | — | Single article |
| GET | `/api/classes` | — | Acting classes + ratings |
| POST | `/api/classes/:id/reviews` | ✓ | Submit a review |
| GET | `/api/admin/applications` | Admin | View pending applications |
| PATCH | `/api/admin/applications/:id` | Admin | Approve / reject |
| PATCH | `/api/admin/users/:id/deactivate` | Admin | Suspend a user |

---

## User Types & Auth Flow

```
Fan (default)
  └─ submits creator application (POST /api/applications)
       └─ Admin approves → user_type promoted to 'creative'
            └─ Can now post projects, apply to roles, edit profile

Admin
  └─ Set manually in DB: UPDATE users SET user_type = 'admin' WHERE email = '...';
```

---

## Deployment Checklist

- [ ] Set `NODE_ENV=production` in environment
- [ ] Set a strong random `JWT_SECRET`
- [ ] Set `DATABASE_URL` to production Postgres
- [ ] Set `ALLOWED_ORIGINS` to your frontend domain(s)
- [ ] Run `npm run migrate` against production DB
- [ ] Deploy to Railway, Render, or Fly.io (all support Node + env vars)
