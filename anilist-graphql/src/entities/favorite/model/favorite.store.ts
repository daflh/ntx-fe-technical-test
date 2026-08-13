import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as favoriteApi from '../api/favoriteApi'
import type { FavoriteId } from './favorite.types'

export const useFavoriteStore = defineStore('favorite', () => {
  const ids = ref<Set<FavoriteId>>(new Set())
  const loaded = ref(false)

  function isFavorite(animeId: FavoriteId): boolean {
    return ids.value.has(animeId)
  }

  // Guards against duplicate concurrent fetches when several FavoriteButton
  // instances mount at once (one per visible anime card) and each asks the
  // store to load.
  let inFlight: Promise<void> | null = null

  function load(): Promise<void> {
    if (loaded.value) return Promise.resolve()
    if (inFlight) return inFlight

    inFlight = favoriteApi
      .fetchFavoriteIds()
      .then((fetched) => {
        ids.value = new Set(fetched)
        loaded.value = true
      })
      .catch(() => {
        // leave unloaded - the next favorites-aware view can retry
      })
      .finally(() => {
        inFlight = null
      })

    return inFlight
  }

  async function toggle(animeId: FavoriteId): Promise<void> {
    const wasFavorite = ids.value.has(animeId)

    // optimistic update, reverted below if the request fails
    const optimistic = new Set(ids.value)
    if (wasFavorite) optimistic.delete(animeId)
    else optimistic.add(animeId)
    ids.value = optimistic

    try {
      if (wasFavorite) await favoriteApi.removeFavorite(animeId)
      else await favoriteApi.addFavorite(animeId)
    } catch {
      const reverted = new Set(ids.value)
      if (wasFavorite) reverted.add(animeId)
      else reverted.delete(animeId)
      ids.value = reverted
    }
  }

  function clear(): void {
    ids.value = new Set()
    loaded.value = false
  }

  return { ids, loaded, isFavorite, load, toggle, clear }
})
