import { searchAnimeResponseSchema, type RawAnimeMedia } from '../api/anime.schema'
import type { AnimeItem, PageInfo } from './anime.types'

/**
 * Pure, dependency-free mapper (Bonus 4): flattens AniList's nested media
 * node into the flat AnimeItem shape the UI consumes. Kept independent of
 * fetch/composable state so it stays trivially unit-testable in isolation.
 */
export function mapAnimeMedia(media: RawAnimeMedia): AnimeItem {
  // English preferred as the friendlier default title for a general
  // audience; falls back to romaji, then a placeholder if both are null.
  const title = media.title.english?.trim() || media.title.romaji?.trim() || 'Untitled'

  return {
    id: media.id,
    title,
    cover: media.coverImage?.large ?? '',
    year: media.seasonYear ?? null,
    episodes: media.episodes ?? null,
    score: media.averageScore ?? null,
    genres: media.genres ?? [],
    url: media.siteUrl ?? '',
  }
}

export interface MapSearchResult {
  items: AnimeItem[]
  pageInfo: PageInfo
}

/**
 * Validates + maps a raw GraphQL response in one step. A schema mismatch
 * (malformed/unexpected response) is treated as a fetch failure by the
 * caller, same as a network error - the app never renders untyped data.
 */
export function mapSearchResponse(raw: unknown): MapSearchResult {
  const result = searchAnimeResponseSchema.safeParse(raw)
  if (!result.success) {
    throw new Error('Unexpected response shape from AniList.')
  }

  const { pageInfo, media } = result.data.Page
  return {
    items: media.map(mapAnimeMedia),
    pageInfo,
  }
}
