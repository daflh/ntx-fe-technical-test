import { authorizedHttp } from '@/shared/api/authorizedHttp'
import { ApiError } from '@/shared/api/apiError'
import { AUTH_BASE } from '@/shared/config/constants'
import { userSchema } from './session.schema'
import type { User } from '../model/session.types'

export interface LoginCredentials {
  username: string
  password: string
}

async function parseUserResponse(response: Response): Promise<User> {
  const body: unknown = await response.json().catch(() => null)
  const result = userSchema.safeParse(body)
  if (!result.success) {
    throw new ApiError(500, 'Unexpected response from server.')
  }
  return result.data
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await fetch(`${AUTH_BASE}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const body: { message?: string } | null = await response.json().catch(() => null)
    throw new ApiError(response.status, body?.message ?? 'Invalid username or password.')
  }

  return parseUserResponse(response)
}

export async function logout(): Promise<void> {
  await fetch(`${AUTH_BASE}/logout`, { method: 'POST', credentials: 'include' }).catch(() => {
    // best-effort: even if this fails (e.g. server down), the caller still
    // clears local session state
  })
}

/** Restores the session on app boot using the HttpOnly access-token cookie.
 * Goes through authorizedHttp so an expired-but-refreshable access token
 * transparently triggers a silent refresh during boot too. */
export async function me(): Promise<User> {
  const raw = await authorizedHttp.get<unknown>(`${AUTH_BASE}/me`)
  const result = userSchema.safeParse(raw)
  if (!result.success) {
    throw new ApiError(500, 'Unexpected response from server.')
  }
  return result.data
}
