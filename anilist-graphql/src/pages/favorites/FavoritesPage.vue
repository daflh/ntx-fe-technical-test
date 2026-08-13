<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useFavoriteStore } from '@/entities/favorite'
import { fetchAnimeByIds, mapSearchResponse, type AnimeItem } from '@/entities/anime'
import FavoriteButton from '@/features/anime-favorite/ui/FavoriteButton.vue'
import { AnimeGrid } from '@/widgets/anime-grid'

const favorites = useFavoriteStore()

const items = ref<AnimeItem[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const loadedOnce = ref(false)

async function loadFavoriteAnime(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    await favorites.load()
    const raw = await fetchAnimeByIds([...favorites.ids])
    items.value = mapSearchResponse(raw).items
  } catch {
    error.value = 'Failed to fetch anime data.'
  } finally {
    loading.value = false
    loadedOnce.value = true
  }
}

void loadFavoriteAnime()

// Un-favoriting a card on this page should drop it from the list right
// away, without a full re-fetch - favorites.ids is reassigned (a new Set)
// on every toggle, so this fires reliably without a deep watcher.
watch(
  () => favorites.ids,
  () => {
    items.value = items.value.filter((item) => favorites.isFavorite(item.id))
  },
)

const showEmpty = computed(
  () => loadedOnce.value && !loading.value && !error.value && items.value.length === 0,
)
</script>

<template>
  <div class="favorites-page">
    <header class="favorites-page__intro">
      <h1>Favorites</h1>
      <p>Anime you've bookmarked while signed in.</p>
    </header>

    <AnimeGrid
      :items="items"
      :loading="loading"
      :error="error"
      :show-empty="showEmpty"
      empty-message="You haven't favorited any anime yet."
      @retry="loadFavoriteAnime"
    >
      <template #card-actions="{ anime }">
        <FavoriteButton :anime-id="anime.id" />
      </template>
    </AnimeGrid>
  </div>
</template>

<style scoped>
.favorites-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.favorites-page__intro h1 {
  margin: 0 0 0.25rem;
  font-size: 1.6rem;
}

.favorites-page__intro p {
  margin: 0;
  color: var(--text, #6b6375);
  font-size: 0.9rem;
}
</style>
