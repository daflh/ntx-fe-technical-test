import { authorizedHttp } from '@/shared/api/authorizedHttp'
import { FAVORITES_BASE } from '@/shared/config/constants'
import type { FavoriteId } from '../model/favorite.types'

export function fetchFavoriteIds(): Promise<FavoriteId[]> {
  return authorizedHttp.get<FavoriteId[]>(FAVORITES_BASE)
}

export function addFavorite(animeId: FavoriteId): Promise<void> {
  return authorizedHttp.post<void>(FAVORITES_BASE, { animeId })
}

export function removeFavorite(animeId: FavoriteId): Promise<void> {
  return authorizedHttp.delete<void>(`${FAVORITES_BASE}/${animeId}`)
}
