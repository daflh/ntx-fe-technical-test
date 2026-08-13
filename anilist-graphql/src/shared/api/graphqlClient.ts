import { ANILIST_ENDPOINT } from '../config/constants'
import { ApiError } from './apiError'

interface GraphQLResponse<T> {
  data?: T
  errors?: { message: string }[]
}

/**
 * Minimal fetch-based GraphQL client for the public AniList API (no auth
 * needed there). Deliberately dependency-free instead of Apollo/urql - see
 * QUESTIONS.md for the tradeoff writeup. Callers pass an AbortSignal so a
 * superseded search (Bonus 2) can cancel the in-flight request; a resulting
 * AbortError is left to propagate untouched so callers can tell "cancelled"
 * apart from "actually failed".
 */
export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(ANILIST_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables }),
    signal,
  })

  const body = (await response.json().catch(() => null)) as GraphQLResponse<T> | null

  if (!response.ok) {
    const message = body?.errors?.[0]?.message ?? `GraphQL request failed with status ${response.status}.`
    throw new ApiError(response.status, message)
  }

  if (body?.errors && body.errors.length > 0) {
    throw new ApiError(200, body.errors[0]!.message)
  }

  if (!body?.data) {
    throw new ApiError(500, 'Unexpected empty GraphQL response.')
  }

  return body.data
}
