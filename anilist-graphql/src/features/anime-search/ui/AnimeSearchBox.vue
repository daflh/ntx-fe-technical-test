<script setup lang="ts">
import { useAnimeSearchBox } from '../model/useAnimeSearchBox'

const { query, loading, submitNow, clear } = useAnimeSearchBox()
</script>

<template>
  <form class="anime-search-box" role="search" @submit.prevent="submitNow">
    <input
      v-model="query"
      type="search"
      placeholder="Search anime title..."
      class="anime-search-box__input"
      aria-label="Search anime"
    />
    <button v-if="query" type="button" class="anime-search-box__clear" aria-label="Clear search" @click="clear">
      &times;
    </button>
    <button type="submit" class="anime-search-box__submit" :disabled="loading">
      {{ loading ? 'Searching...' : 'Search' }}
    </button>
  </form>
</template>

<style scoped>
.anime-search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 480px;
  width: 100%;
}

.anime-search-box__input {
  flex: 1;
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--border, #cbd5e1);
  border-radius: 0.5rem;
  font-size: 0.95rem;
  background: var(--bg, #fff);
  color: var(--text-h, #08060d);
}

.anime-search-box__clear {
  border: none;
  background: transparent;
  color: var(--text, #6b6375);
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
}

.anime-search-box__submit {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background: var(--accent, #aa3bff);
  color: white;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.anime-search-box__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
