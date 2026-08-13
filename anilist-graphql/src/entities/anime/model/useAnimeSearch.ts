import { computed, ref } from 'vue'
import { createSharedComposable } from '@vueuse/core'
import { fetchAnimeSearchPage } from '../api/animeApi'
import { mapSearchResponse } from './anime.mapper'
import type { AnimeItem, PageInfo } from './anime.types'

function _useAnimeSearch() {
  const data = ref<AnimeItem[]>([])
  const pageInfo = ref<PageInfo | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasSearched = ref(false)
  // Exposed (unlike the other internal bookkeeping below) so pages can
  // re-run the last search on demand, e.g. an ErrorBanner "Retry" click.
  const lastKeyword = ref('')

  // Kept as a plain variable (not a ref) - it's an implementation detail,
  // not UI state, and doesn't need to be reactive/proxied.
  let controller: AbortController | null = null
  // Monotonic guard: belt-and-suspenders alongside AbortController for
  // Bonus 2 (request cancellation). abort() saves bandwidth and shows up
  // as "(canceled)" in DevTools; requestSeq additionally covers the edge
  // case where an aborted fetch's rejection still resolves after a newer
  // request has already landed and mutated state.
  let requestSeq = 0

  async function runSearch(keyword: string, page: number, append: boolean): Promise<void> {
    controller?.abort()
    const ac = new AbortController()
    controller = ac
    const seq = ++requestSeq

    loading.value = true
    error.value = null

    try {
      const raw = await fetchAnimeSearchPage({ search: keyword, page }, ac.signal)
      if (seq !== requestSeq) return // superseded by a newer request

      const mapped = mapSearchResponse(raw)
      data.value = append ? [...data.value, ...mapped.items] : mapped.items
      pageInfo.value = mapped.pageInfo
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return // cancelled, not a real failure
      if (seq !== requestSeq) return
      error.value = 'Failed to fetch anime data.'
    } finally {
      if (seq === requestSeq) loading.value = false
    }
  }

  /** Required composable entry point: sends the GraphQL request, fills
   * data, resets to page 1, and manages loading/error state. */
  function searchAnime(keyword: string): void {
    const trimmed = keyword.trim()
    lastKeyword.value = trimmed
    data.value = []
    pageInfo.value = null

    if (!trimmed) {
      controller?.abort()
      requestSeq += 1
      loading.value = false
      error.value = null
      hasSearched.value = false
      return
    }

    hasSearched.value = true
    void runSearch(trimmed, 1, false)
  }

  /** Fetches the next page (only meaningful while hasNextPage) and appends. */
  function loadMore(): void {
    if (loading.value || !pageInfo.value?.hasNextPage) return
    void runSearch(lastKeyword.value, pageInfo.value.currentPage + 1, true)
  }

  /** Re-runs the last search from page 1 - e.g. an ErrorBanner "Retry" click. */
  function retry(): void {
    if (!lastKeyword.value) return
    data.value = []
    pageInfo.value = null
    void runSearch(lastKeyword.value, 1, false)
  }

  function reset(): void {
    controller?.abort()
    requestSeq += 1
    lastKeyword.value = ''
    data.value = []
    pageInfo.value = null
    loading.value = false
    error.value = null
    hasSearched.value = false
  }

  const isEmpty = computed(
    () => hasSearched.value && !loading.value && !error.value && data.value.length === 0,
  )
  const canLoadMore = computed(() => pageInfo.value?.hasNextPage === true)

  return {
    data,
    pageInfo,
    loading,
    error,
    hasSearched,
    lastKeyword,
    isEmpty,
    canLoadMore,
    searchAnime,
    loadMore,
    retry,
    reset,
  }
}

// createSharedComposable makes this a singleton instance across the app -
// SearchPage, the search box, and the load-more control all read/write the
// same state without prop drilling or duplicate fetches.
export const useAnimeSearch = createSharedComposable(_useAnimeSearch)
