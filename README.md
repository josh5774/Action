# FilmLink

A community platform connecting emerging film industry creatives with opportunities, education, and networking.

## Monorepo Structure

```
filmlink/
├── web/          React web app
├── mobile/       React Native (Expo) mobile app
├── backend/      Node.js + Express API
├── packages/
│   └── shared/   Shared constants, types, validators
├── turbo.json
└── package.json
```

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Web      | React 18, React Router, Axios, Zustand |
| Mobile   | React Native (Expo), React Navigation |
| Backend  | Node.js, Express, PostgreSQL      |
| Monorepo | Turborepo + npm workspaces        |

## Getting Started

### Prerequisites
- Node.js >= 18
- PostgreSQL
- npm >= 9

### Install all dependencies
```bash
npm install
```

### Environment variables
Copy `.env.example` to `.env` in each workspace:
```bash
cp backend/.env.example backend/.env
cp web/.env.example web/.env
cp mobile/.env.example mobile/.env
```

### Run all dev servers
```bash
npm run dev
```

Or run individually:
```bash
# API server (port 4000)
cd backend && npm run dev

# Web app (port 3000)
cd web && npm run dev

# Mobile (Expo)
cd mobile && npm start
```

### Database setup
```bash
psql -U postgres -c "CREATE DATABASE filmlink;"
psql -U postgres -d filmlink -f backend/src/db/migrations/001_initial_schema.sql
```

## Development Phases

- **Phase 1 (MVP):** Profiles, projects, applications, articles, events, admin dashboard
- **Phase 2:** Messaging, activity feed, reviews, push notifications
- **Phase 3:** Video auditions, advanced search, premium memberships
