# Action

Action is a platform for emerging film creatives and film fans. The product vision is a two-sided ecosystem: a vetted creator network for actors, writers, directors, producers, cinematographers, editors, composers, and other collaborators, plus an open entertainment hub for articles, events, screenings, and discovery. The business materials describe it as a blend of casting marketplace, creative networking, education, events, and media for the next generation of filmmakers.

## Product vision

### For creators
Action is intended to help emerging creatives:
- find auditions and projects
- meet collaborators
- build professional profiles and reels
- attend mixers and events
- access acting classes and education

### For fans and industry followers
Action is also intended to support a public-facing audience that can:
- read articles and entertainment coverage
- follow creators
- attend screenings and events
- discover rising talent

### Core feature areas
The attached planning documents consistently define these core product areas:
- creator profiles
- project marketplace / casting
- acting classes and education
- events and mixers
- entertainment news and editorial content
- admin approval and moderation systems
- messaging, activity feed, reviews, and notifications in later phases

## Current repository state

This repository is an in-progress monorepo/prototype and currently contains multiple parallel pieces of the Action product:

- `backend/` — Express backend scaffold
- `web/` — React web app scaffold
- `mobile/` — Expo / React Native mobile app scaffold
- `packages/shared/` — shared package
- root Prisma schema and seed files — current database design and seed data
- `docs/` and root prototype files — planning docs, HTML mockups, and UI experiments

A few important notes about the repo as it exists today:

- The database schema is currently defined at the repository root with Prisma and PostgreSQL files such as `schema.prisma`, `seed.ts`, and `001_init.sql`.
- The backend currently exposes route scaffolds for auth, users, projects, events, articles, and classes.
- The web app includes React app files and also contains Vite config, so the frontend tooling is not fully standardized yet.
- The mobile app is present as an Expo app, but the product is still clearly in an early build stage rather than a finished MVP.

## Repository structure

```text
.
├── backend/            # Express API scaffold
├── client/             # currently not the main active app entrypoint
├── docs/               # project docs and supporting materials
├── mobile/             # Expo / React Native app scaffold
├── packages/
│   └── shared/         # shared package
├── server/             # currently not the main active app entrypoint
├── web/                # React web app scaffold
├── schema.prisma       # Prisma schema for Action domain models
├── seed.ts             # development seed data
├── 001_init.sql        # SQL migration / initialization
├── turbo.json          # Turborepo task config
└── README.md
```

## What is implemented right now

### Database design
The Prisma schema already models much of the planned platform, including:
- users and creator/fan/admin roles
- profiles, skills, credits, and portfolio items
- follows / social graph
- projects, roles, and applications
- events and attendees
- articles
- acting classes and reviews
- notifications
- admin logs

### Backend scaffold
The backend currently has:
- Express server setup
- CORS / Helmet / Morgan middleware
- route placeholders for:
  - `/api/auth`
  - `/api/users`
  - `/api/projects`
  - `/api/events`
  - `/api/articles`
  - `/api/classes`
- health endpoint at `/health`

### Web scaffold
The web app currently has:
- React + React Router structure
- placeholder routes/pages for:
  - Home
  - Projects
  - Profile
  - Classes
  - Events
  - Articles
  - Login
  - Sign Up
  - Apply

### Mobile scaffold
The mobile app currently has:
- Expo setup
- React Navigation dependencies
- image picker, secure storage, React Query, and Zustand dependencies

## Product roadmap reflected by the docs

### Phase 1 / MVP
The business and pitch materials emphasize Phase 1 around:
- profiles
- applications
- project listings
- articles
- events
- admin review / approval
- initial NYC go-to-market testing

### Phase 2
Later roadmap items include:
- messaging
- social/activity feed
- class reviews
- notifications
- more community interaction and in-person growth

### Longer-term vision
The long-term goal is for Action to become a professional ecosystem and pipeline for emerging film talent, especially pre-union creatives who do not have a centralized network today.

## Getting started

Because the repo is still in transition, the safest way to work with it is by treating each surface separately.

### 1) Database / schema at the repo root
Install root dependencies and configure Prisma:

```bash
npm install
cp .env.example .env
# edit DATABASE_URL in .env
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npx prisma studio
```

### 2) Backend
Start the Express backend:

```bash
cd backend
npm install
npm run dev
```

Expected default port: `4000`

### 3) Web
Start the web app:

```bash
cd web
npm install
npm run dev
```

Note: the repo currently contains both CRA-style and Vite-style frontend signals, so frontend setup should be standardized before beta.

### 4) Mobile
Start the Expo app:

```bash
cd mobile
npm install
npm start
```

## Environment variables

### Root / Prisma
At minimum, the database layer needs:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/action?schema=public
```

### Backend
`backend/.env.example` currently includes values for:

```env
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/action
JWT_SECRET=change_me_in_production
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:3000
AWS_BUCKET_NAME=
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

## Current gaps

This repo has strong planning and a meaningful schema foundation, but it is not yet a finished beta. The biggest gaps right now are:

- duplicate / ambiguous project structure at the repo root vs `backend/` / `web/`
- backend feature routes are mostly stubs
- frontend pages are mostly placeholders
- admin workflows are planned but not fully implemented
- monetization, moderation, messaging, and notification systems are still mostly at the requirements stage
- deployment and developer onboarding are not standardized yet

## Recommended next steps

1. Pick one canonical app structure and remove duplicate entry points.
2. Standardize the web app on one frontend toolchain.
3. Connect auth + profile creation end-to-end.
4. Build one complete vertical slice:
   - creator application
   - admin approval
   - project listing
   - project application
5. Move roadmap and planning docs into a clean `/docs` structure.
6. Add screenshots and architecture diagrams once the app surfaces are more stable.

## Source materials

This README is based on:
- the current public repository structure and package files
- the Action pitch deck
- the Action business plan and technical requirements document

## License

No license has been specified in this repository yet.
