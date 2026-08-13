# School Vector Map

Interactive vector map showing Indonesian school locations, built for the NTX Frontend Engineer technical test (BAB 03). Vue 3 + Composition API + TypeScript on the frontend, MapLibre GL JS for the vector map, and a small local Express server providing JWT + refresh-token authentication with HttpOnly cookies.

## Stack

- **Vue 3** (Composition API) + **TypeScript**
- **MapLibre GL JS** for the vector/WebGL map, styled via [OpenFreeMap](https://openfreemap.org) (free, no API key)
- **Vue Router** for routing + auth/RBAC guards
- **Pinia** for session state
- **Zod** for runtime validation/mapping of API responses
- **@vueuse/core** for a shared-composable singleton and debounced search
- **Express** (in `server/`) as a small mock auth backend issuing real HttpOnly JWT cookies
- **pnpm** as the package manager

Folder structure follows **Feature-Sliced Design** (`app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/`).

## Running locally

Requires Node.js 18+ and [pnpm](https://pnpm.io/installation).

```bash
pnpm install
pnpm dev
```

`pnpm dev` runs **two processes together** (via `concurrently`):

- the Vite dev server (frontend) at `http://localhost:5173`
- the mock Express auth server (`server/`) at `http://localhost:4000`, proxied by Vite under `/api/*` so cookies are same-origin

Open `http://localhost:5173`.

Other scripts:

```bash
pnpm dev:client         # frontend only
pnpm dev:server         # mock auth server only
pnpm build              # type-checks + builds the frontend for production
pnpm preview            # preview the production build
pnpm typecheck:server   # type-checks server/ (kept out of the frontend's tsc build)
```

## Demo accounts

The login page has one-click "fill" buttons for both. Credentials also listed here:

| Username | Password   | Role   |
|----------|------------|--------|
| `admin`  | `admin123` | admin  |
| `viewer` | `viewer123`| viewer |

- Both roles can access the map (`/`).
- Only `admin` can access `/admin` (a small RBAC demo page backed by a real protected server endpoint `GET /api/admin/stats`). Logging in as `viewer` and visiting `/admin` redirects to a 403 Forbidden page.

## Auth flow notes

- Login calls `POST /api/auth/login`; the server issues a short-lived **access token** and a longer-lived **refresh token** as **HttpOnly cookies** (never returned in the response body).
- The access token TTL is **deliberately set to 60 seconds** (see `server/config/env.ts`) so the silent-refresh flow is easy to observe locally: stay on a protected page for a bit over a minute, trigger any authorized request, and watch the Network tab show a `401` on the original request immediately followed by `POST /api/auth/refresh` and a transparent retry, with no visible disruption to the UI. A real deployment would use a longer TTL (e.g. 5-15 minutes).
- Refreshing the browser page does not log you out - session is restored from the cookie via `GET /api/auth/me` on boot, not from any client-side storage.
- Logging out clears both cookies server-side.

## Known simplifications / assumptions

- The mock server uses **hardcoded, plaintext demo credentials** (`server/data/demoUsers.ts`) and in-memory JWT secrets with demo fallbacks. This is intentional for a local technical-test environment and is **not** how a real user store/secret management would work.
- No refresh-token rotation or revocation store - a stolen refresh token remains valid until it expires. A production system would rotate refresh tokens on use and track revocation.
- The `/admin` page and its role restriction were **added by the candidate** (not explicitly specified by the map requirements) specifically to give the RBAC requirement from the test's general instructions something concrete to demonstrate, since the map feature itself has no natural admin/viewer split.
- Clustering and URL-state-sync (two of the five optional bonus challenges) were intentionally not implemented, to keep scope focused; Search and Layer Visualization were implemented instead.
- The schools dataset is fetched and validated client-side once per app session (via a shared composable) rather than paginated - see the answer to "if the endpoint returned 50,000 schools" in `QUESTIONS.md` for how this would change at scale.
