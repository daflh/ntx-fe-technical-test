import { ApiError } from './apiError'

/**
 * Minimal fetch wrapper for public, unauthenticated endpoints (the schools
 * data source). No cookies, no retry/refresh logic - that lives in
 * authorizedHttp.ts for endpoints behind our own auth.
 */
export async function fetchJson<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, init)
  } catch {
    throw new ApiError(0, 'Network error.')
  }

  if (!response.ok) {
    throw new ApiError(response.status, `Request failed with status ${response.status}.`)
  }

  return (await response.json()) as T
}
