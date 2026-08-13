export const PORT = Number(process.env.PORT ?? 5170)

// DEMO ONLY: hardcoded fallback secrets. A real deployment must supply these via env vars.
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? 'demo-access-secret-do-not-use-in-prod'
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? 'demo-refresh-secret-do-not-use-in-prod'

// Deliberately short so silent refresh is easy to observe/test locally.
// A production access token would typically live 5-15 minutes.
export const ACCESS_TOKEN_TTL = '60s'
export const ACCESS_TOKEN_TTL_MS = 60 * 1000

export const REFRESH_TOKEN_TTL = '7d'
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000
