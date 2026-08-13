<script setup lang="ts">
import LoadingIndicator from '@/shared/ui/LoadingIndicator.vue'
import ErrorBanner from '@/shared/ui/ErrorBanner.vue'
import { AnimeCard, type AnimeItem } from '@/entities/anime'

withDefaults(
  defineProps<{
    items: AnimeItem[]
    loading: boolean
    error: string | null
    /** Caller decides when "empty" is meaningful (e.g. only after a search
     * has actually run) - this widget stays presentational and doesn't
     * guess. */
    showEmpty: boolean
    emptyMessage?: string
  }>(),
  { emptyMessage: 'Anime not found.' },
)

defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="anime-grid">
    <LoadingIndicator v-if="loading && items.length === 0" label="Loading anime..." />
    <ErrorBanner v-else-if="error" message="Failed to fetch anime data." retryable @retry="$emit('retry')" />
    <p v-else-if="showEmpty" class="anime-grid__empty">{{ emptyMessage }}</p>

    <div v-if="items.length > 0" class="anime-grid__list">
      <AnimeCard v-for="anime in items" :key="anime.id" :anime="anime">
        <template #actions="slotProps">
          <slot name="card-actions" v-bind="slotProps" />
        </template>
      </AnimeCard>
    </div>

    <div v-if="loading && items.length > 0" class="anime-grid__loading-more">
      <LoadingIndicator label="Loading more..." />
    </div>
  </div>
</template>

<style scoped>
.anime-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.anime-grid__empty {
  color: var(--text, #6b6375);
  font-size: 0.95rem;
  padding: 2rem 0;
  text-align: center;
}

.anime-grid__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.anime-grid__loading-more {
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
}
</style>
