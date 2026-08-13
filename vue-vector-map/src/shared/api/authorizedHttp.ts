import { AUTH_BASE } from '../config/constants'
import { ApiError } from './apiError'

/**
 * Fetch wrapper for endpoints behind our own auth (cookie-based JWT).
 * On a 401 it transparently calls the refresh endpoint once, retries the
 * original request, and if refresh also fails notifies the app so it can
 * clear session state and redirect to /login - all without the caller
 * having to think about tokens.
 *
 * This module intentionally has no import-time dependency on the Pinia
 * session store or vue-router (shared/ must not depend on entities/ or
 * app/ per FSD layering). Instead the app bootstrap registers a callback
 * via setUnauthorizedHandler().
 */

type UnauthorizedHandler = () => void

let onUnauthorized: UnauthorizedHandler | null = null

export function setUnauthorizedHandler(handler: UnauthorizedHandler): void {
  onUnauthorized = handler
}

let refreshInFlight: Promise<boolean> | null = null

function isAuthEndpoint(path: string, endpoint: 'refresh' | 'login'): boolean {
  return path.startsWith(`${AUTH_BASE}/${endpoint}`)
}

async function callRefresh(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${AUTH_BASE}/refresh`, { method: 'POST', credentials: 'include' })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null
      })
  }
  return refreshInFlight
}

interface AuthorizedRequestInit extends RequestInit {
  /** internal flag to prevent infinite retry loops */
  _retried?: boolean
}

async function request<T>(path: string, init: AuthorizedRequestInit = {}): Promise<T> {
  const response = await fetch(path, { ...init, credentials: 'include' })

  if (response.status === 401 && !init._retried && !isAuthEndpoint(path, 'refresh') && !isAuthEndpoint(path, 'login')) {
    const refreshed = await callRefresh()
    if (refreshed) {
      return request<T>(path, { ...init, _retried: true })
    }
    onUnauthorized?.()
    throw new ApiError(401, 'Session expired.')
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`
    try {
      const body = (await response.json()) as { message?: string }
      if (body?.message) message = body.message
    } catch {
      // response had no JSON body - keep the generic message
    }
    throw new ApiError(response.status, message)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const authorizedHttp = {
  get: <T = unknown>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T = unknown>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    }),
}
