# Hi.post Frontend

Vite + React + TypeScript SPA for the Hidragonfly postcard editor.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server at [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint |
| `npm run knip` | Find unused exports and dependencies |
| `npm run knip:files` | Find unused files |

## Environment

Copy `.env.example` to `.env` for local Vite:

- `VITE_AUTH_MODE=http` — Laravel session + `/v2` cloud copy (staging default). IndexedDB remains the cache; first login uploads local files and rows.
- `VITE_AUTH_MODE=mock` — localStorage auth, no API (offline / no-backend machines)
- `VITE_API_BASE_URL` — leave empty when API is on the same origin (`/api`)
- `VITE_DEV_API_PROXY` — backend URL for dev proxy (default `http://127.0.0.1:8000`)

`npm run build` always loads `.env.production` (`VITE_AUTH_MODE=http`) so nginx `frontend/dist` is not a mock SPA.

After switching a browser from mock to http: sign in, then check factory, cart, history, empty pie, favorites, and dates. A network failure on `/me` keeps the last session instead of logging out.

## Project structure

```
src/
  app/        — store, sagas, global styles
  entities/   — domain types and models
  features/   — feature modules (UI, Redux, API)
  shared/     — reusable UI, hooks, utils, config
  db/         — IndexedDB adapters
  i18n/       — localization
  styles/     — design tokens
```

## Docker

From the repo root, `docker compose up` runs frontend (dev with `VITE_AUTH_MODE=http`), backend, nginx, and MySQL together. Nginx static files come from `frontend/dist`; rebuild that with `npm run build` in `frontend/` after pulling cutover.
