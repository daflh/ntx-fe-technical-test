export interface AnimeItem {
  id: number
  title: string
  cover: string
  year: number | null
  episodes: number | null
  score: number | null
  genres: string[]
  url: string
}

export interface PageInfo {
  currentPage: number
  hasNextPage: boolean
  total: number
}
