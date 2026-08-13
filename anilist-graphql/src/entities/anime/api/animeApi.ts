import { graphqlRequest } from '@/shared/api/graphqlClient'
import { ANIME_PER_PAGE } from '@/shared/config/constants'

// Field selection matches the spec exactly, plus pageInfo/id_in variant
// reused by the Favorites feature to re-fetch details for bookmarked ids.
const ANIME_MEDIA_FIELDS = `
  id
  title {
    romaji
    english
  }
  coverImage {
    large
  }
  seasonYear
  episodes
  averageScore
  genres
  siteUrl
`

export const SEARCH_ANIME_QUERY = `
  query SearchAnime($search: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
        hasNextPage
        total
      }
      media(search: $search, type: ANIME) {
        ${ANIME_MEDIA_FIELDS}
      }
    }
  }
`

export const ANIME_BY_IDS_QUERY = `
  query AnimeByIds($ids: [Int]) {
    Page(perPage: 50) {
      pageInfo {
        currentPage
        hasNextPage
        total
      }
      media(id_in: $ids, type: ANIME) {
        ${ANIME_MEDIA_FIELDS}
      }
    }
  }
`

export interface SearchAnimeVariables {
  search: string
  page: number
  perPage?: number
}

export function fetchAnimeSearchPage(variables: SearchAnimeVariables, signal?: AbortSignal): Promise<unknown> {
  return graphqlRequest(
    SEARCH_ANIME_QUERY,
    { search: variables.search, page: variables.page, perPage: variables.perPage ?? ANIME_PER_PAGE },
    signal,
  )
}

const EMPTY_PAGE_RESPONSE = {
  Page: { pageInfo: { currentPage: 1, hasNextPage: false, total: 0 }, media: [] },
}

export function fetchAnimeByIds(ids: number[], signal?: AbortSignal): Promise<unknown> {
  if (ids.length === 0) return Promise.resolve(EMPTY_PAGE_RESPONSE)
  return graphqlRequest(ANIME_BY_IDS_QUERY, { ids }, signal)
}
