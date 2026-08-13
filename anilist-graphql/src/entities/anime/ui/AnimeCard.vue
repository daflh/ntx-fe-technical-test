<script setup lang="ts">
import type { AnimeItem } from '../model/anime.types'

defineProps<{ anime: AnimeItem }>()

function formatScore(score: number | null): string {
  return score === null ? '—' : `${score}%`
}

function formatMeta(anime: AnimeItem): string {
  const parts: string[] = []
  if (anime.year) parts.push(String(anime.year))
  if (anime.episodes) parts.push(`${anime.episodes} eps`)
  return parts.length > 0 ? parts.join(' · ') : '—'
}
</script>

<template>
  <article class="anime-card">
    <div class="anime-card__cover-wrap">
      <img v-if="anime.cover" class="anime-card__cover" :src="anime.cover" :alt="anime.title" loading="lazy" />
      <div v-else class="anime-card__cover anime-card__cover--placeholder" aria-hidden="true">No image</div>
      <div class="anime-card__actions">
        <slot name="actions" :anime="anime" />
      </div>
    </div>

    <div class="anime-card__body">
      <a class="anime-card__title" :href="anime.url" target="_blank" rel="noopener noreferrer" :title="anime.title">
        {{ anime.title }}
      </a>
      <p class="anime-card__meta">{{ formatMeta(anime) }} · ★ {{ formatScore(anime.score) }}</p>
      <ul v-if="anime.genres.length > 0" class="anime-card__genres">
        <li v-for="genre in anime.genres.slice(0, 3)" :key="genre">{{ genre }}</li>
      </ul>
    </div>
  </article>
</template>

<style scoped>
.anime-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border, #e5e4e7);
  border-radius: 0.75rem;
  overflow: hidden;
  background: var(--bg, #fff);
  transition: box-shadow 0.2s;
}

.anime-card:hover {
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.1);
}

.anime-card__cover-wrap {
  position: relative;
  aspect-ratio: 2 / 3;
  background: var(--code-bg, #f4f3ec);
}

.anime-card__cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.anime-card__cover--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text, #6b6375);
  font-size: 0.8rem;
}

.anime-card__actions {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
}

.anime-card__body {
  padding: 0.6rem 0.7rem 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
}

.anime-card__title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-h, #08060d);
  text-decoration: none;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.25;
}

.anime-card__title:hover {
  color: var(--accent, #aa3bff);
}

.anime-card__meta {
  font-size: 0.78rem;
  color: var(--text, #6b6375);
  margin: 0;
}

.anime-card__genres {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  padding: 0;
  margin: 0.2rem 0 0;
}

.anime-card__genres li {
  font-size: 0.68rem;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  background: var(--accent-bg, rgba(170, 59, 255, 0.1));
  color: var(--accent, #aa3bff);
}
</style>
