<script setup lang="ts">
import { useAnimeSearch } from '@/entities/anime'
import AnimeSearchBox from '@/features/anime-search/ui/AnimeSearchBox.vue'
import FavoriteButton from '@/features/anime-favorite/ui/FavoriteButton.vue'
import { AnimeGrid } from '@/widgets/anime-grid'

const { data, loading, error, isEmpty, canLoadMore, loadMore, retry, pageInfo } = useAnimeSearch()
</script>

<template>
  <div class="search-page">
    <header class="search-page__intro">
      <h1>AniSearch</h1>
      <p>Search anime by title, powered by the AniList GraphQL API.</p>
      <AnimeSearchBox />
    </header>

    <p v-if="pageInfo && data.length > 0" class="search-page__count">
      Showing {{ data.length }} of {{ pageInfo.total }} results
    </p>

    <AnimeGrid :items="data" :loading="loading" :error="error" :show-empty="isEmpty" @retry="retry">
      <template #card-actions="{ anime }">
        <FavoriteButton :anime-id="anime.id" />
      </template>
    </AnimeGrid>

    <div v-if="canLoadMore" class="search-page__load-more">
      <button type="button" :disabled="loading" @click="loadMore">
        {{ loading ? 'Loading...' : 'Load More' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.search-page__intro h1 {
  margin: 0 0 0.25rem;
  font-size: 1.6rem;
}

.search-page__intro p {
  margin: 0 0 1rem;
  color: var(--text, #6b6375);
  font-size: 0.9rem;
}

.search-page__count {
  margin: 0;
  font-size: 0.82rem;
  color: var(--text, #6b6375);
}

.search-page__load-more {
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;
}

.search-page__load-more button {
  padding: 0.55rem 1.25rem;
  border: 1px solid var(--border, #cbd5e1);
  border-radius: 999px;
  background: var(--bg, white);
  color: var(--text-h, #08060d);
  font-weight: 600;
  cursor: pointer;
}

.search-page__load-more button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
