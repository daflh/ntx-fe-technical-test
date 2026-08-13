import { fetchJson } from '@/shared/api/http'
import { SCHOOLS_API_URL } from '@/shared/config/constants'

export function fetchRawSchools(): Promise<unknown> {
  return fetchJson<unknown>(SCHOOLS_API_URL)
}
