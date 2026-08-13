import { ref, watch } from 'vue'
import { refDebounced } from '@vueuse/core'
import { useAnimeSearch } from '@/entities/anime'

/**
 * Bonus 1 (Debounce Search): owns the raw input ref separately from the
 * entity's useAnimeSearch composable, so the required searchAnime(keyword)
 * signature stays a plain, directly callable function - debounce is a
 * UI-layer concern layered on top, not baked into the entity itself.
 * refDebounced is the same @vueuse/core primitive the sibling BAB03
 * project used for its own search box (there at 300ms; the PDF's own
 * useDebounce(searchKeyword, 500) example calls for 500ms here).
 */
export function useAnimeSearchBox() {
  const { searchAnime, reset, loading } = useAnimeSearch()

  const query = ref('')
  const debouncedQuery = refDebounced(query, 500)

  watch(debouncedQuery, (value) => {
    const trimmed = value.trim()
    if (trimmed) searchAnime(trimmed)
    else reset()
  })

  /** Lets Enter / the search button trigger immediately, bypassing the debounce wait. */
  function submitNow(): void {
    const trimmed = query.value.trim()
    if (trimmed) searchAnime(trimmed)
    else reset()
  }

  function clear(): void {
    query.value = ''
    reset()
  }

  return { query, loading, submitNow, clear }
}
