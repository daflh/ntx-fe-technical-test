# AniSearch

Anime search built for the NTX Frontend Engineer technical test (BAB 04). Vue 3 + Composition API +
TypeScript on the frontend, a lightweight hand-rolled GraphQL client against the public
[AniList GraphQL API](https://anilist.co/graphiql), and a small local Express server providing JWT +
refresh-token authentication with HttpOnly cookies.

## Stack

- **Vue 3** (Composition API) + **TypeScript**
- Hand-rolled `fetch`-based GraphQL client (`shared/api/graphqlClient.ts`) against `https://graphql.anilist.co` -
  no Apollo/urql, see "Known simplifications" below and `QUESTIONS.md` for the tradeoff writeup
- **Vue Router** for routing + auth/RBAC guards
- **Pinia** for session and favorites state
- **Zod** for runtime validation of the AniList response and the own-server responses
- **@vueuse/core** for `refDebounced` (Bonus 1) and `createSharedComposable` (shared composable singletons)
- **Express** (in `server/`) as a small mock auth backend issuing real HttpOnly JWT cookies, plus a
  tiny in-memory favorites store
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
- the mock Express auth server (`server/`) at `http://localhost:5170`, proxied by Vite under `/api/*` so cookies are same-origin

Open `http://localhost:5173`.

Other scripts:

```bash
pnpm dev:client         # frontend only
pnpm dev:server         # mock auth server only
pnpm build              # type-checks + builds the frontend for production
pnpm preview            # preview the production build
pnpm typecheck:server   # type-checks server/ (kept out of the frontend's tsc build)
```

## Using the search

Type a title in the search box (e.g. "naruto") - results appear automatically ~500ms after you stop
typing (Bonus 1: debounce). Typing quickly and changing the keyword cancels the previous in-flight
request (Bonus 2: request cancellation via `AbortController` + a sequence guard - open DevTools'
Network tab and type fast to see earlier requests marked `(canceled)`). Click **Load More** to fetch
and append the next page. Searching something with no matches shows "Anime not found."; a failed
request shows "Failed to fetch anime data." without crashing the app.

## Demo accounts

The login page has one-click "fill" buttons for both. Credentials also listed here (same accounts as
the sibling `vue-vector-map` BAB 03 project, kept identical on purpose):

| Username | Password    | Role   |
|----------|-------------|--------|
| `admin`  | `admin123`  | admin  |
| `viewer` | `viewer123` | viewer |

- **Search (`/`)** is public - no login required, matching the BAB 04 mockup.
- **Favorites (`/favorites`)** requires login. Clicking the bookmark icon on a card while signed out
  redirects to `/login` and brings you back afterwards; while signed in it toggles the anime in/out of
  your favorites (persisted server-side, in-memory).
- **Admin (`/admin`)** requires the `admin` role and shows small aggregate stats via a real protected
  server endpoint (`GET /api/admin/stats`). Logging in as `viewer` and visiting `/admin` redirects to
  a 403 Forbidden page. This page isn't part of the search feature itself - it exists to give the
  test's mandatory RBAC requirement (BAB 00 §06) something concrete to demonstrate, the same way the
  sibling project's `/admin` page does.

## Auth flow notes

- Login calls `POST /api/auth/login`; the server issues a short-lived **access token** and a
  longer-lived **refresh token** as **HttpOnly cookies** (never returned in the response body).
- The access token TTL is **deliberately set to 60 seconds** (see `server/config/env.ts`) so the
  silent-refresh flow is easy to observe locally: stay on any page for a bit over a minute, trigger any
  authorized request (e.g. reload `/admin`), and watch the Network tab show a `401` on `/api/auth/me`
  immediately followed by `POST /api/auth/refresh` and a transparent retry, with no visible disruption
  to the UI. A real deployment would use a longer TTL (e.g. 5-15 minutes).
- Refreshing the browser page does not log you out - session is restored from the cookie via
  `GET /api/auth/me` on boot, not from any client-side storage.
- Logging out clears both cookies server-side.

## Known simplifications / assumptions

- **GraphQL client**: a small hand-rolled `fetch` wrapper was used instead of Apollo Client/urql/
  graphql-request. This keeps Bonus 2 (request cancellation via `AbortController`) and Bonus 4 (a pure,
  dependency-free mapper) simple, and matches the sibling project's minimalist style. See
  `QUESTIONS.md` (BAG 3, Q6) for when Apollo would actually be the better choice.
- **Favorites and the Admin page are additions beyond BAB 04's literal requirements**, added because
  BAB 00's general instructions mandate full JWT auth + RBAC for this chapter ("soal nomor 4"), and the
  search feature itself has no natural public/private split. Favorites gives the auth requirement a
  concrete, mockup-consistent purpose (the bookmark icon shown on every card in the BAB 04 preview);
  Admin demonstrates the RBAC 403 case.
- **AniList's search `pageInfo.total` can be a large, approximate number** (a known quirk of AniList's
  own fuzzy-search count, not something this app computes) - it's shown as-is ("Showing 12 of N
  results") rather than treated as an exact count.
- **The mock server uses hardcoded, plaintext demo credentials** (`server/data/demoUsers.ts`) and an
  in-memory JWT secret with a demo fallback. This is intentional for a local technical-test environment
  and is **not** how a real user store/secret management would work.
- **Favorites are stored in-memory on the server** (`server/data/favoritesStore.ts`) - they reset
  whenever the server restarts. A real backend would persist them in a database.
- **No refresh-token rotation or revocation store** - a stolen refresh token remains valid until it
  expires. A production system would rotate refresh tokens on use and track revocation.
- Bonus 3 (Cache by Query) and Bonus 5 (Unit Test) were intentionally not implemented, to keep scope
  to what was requested (Bonus 1, 2, and 4).
