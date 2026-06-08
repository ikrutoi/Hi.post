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

Copy `.env.example` to `.env`:

- `VITE_AUTH_MODE=mock` — local auth via localStorage (default)
- `VITE_AUTH_MODE=http` — Laravel API auth
- `VITE_API_BASE_URL` — leave empty when API is on the same origin (`/api`)
- `VITE_DEV_API_PROXY` — backend URL for dev proxy (default `http://127.0.0.1:8000`)

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

From the repo root, `docker compose up` runs frontend (dev), backend, nginx, and MySQL together.
