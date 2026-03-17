# FilmLink

This repo now has one canonical stack:

- `backend/` — the only API service
- `web/` — the only web client
- `mobile/` — Expo client
- `packages/shared/` — shared constants and helpers

## What changed

The repo previously had three competing app shapes:

- a loose root-level API/Prisma setup
- a separate `backend/` Express app
- a `web/` client with both CRA and Vite signals

That ambiguity has been removed.

- The root `package.json` is now a workspace shell, not an app.
- Prisma/database files live under `backend/prisma/`.
- The runnable backend entrypoint is `backend/src/index.js`.
- The runnable web app is Vite-based and lives in `web/`.
- Legacy duplicate files were moved under `archive/` so they do not look active.

## Getting started

Run `npm install` and then `npm run dev`.

## Current status

This cleanup removes structural ambiguity, but it does not make the product beta-ready by itself.
