<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { useFavoriteStore } from '@/entities/favorite'

const props = defineProps<{ animeId: number }>()

const router = useRouter()
const route = useRoute()
const session = useSessionStore()
const favorites = useFavoriteStore()

const isFavorite = computed(() => favorites.isFavorite(props.animeId))

onMounted(() => {
  if (session.isAuthenticated) void favorites.load()
})

function handleClick(): void {
  // Icon is visible to guests too (per the mockup) - clicking it while
  // logged out prompts login instead of toggling, and the login redirect
  // brings them right back here afterwards.
  if (!session.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  void favorites.toggle(props.animeId)
}
</script>

<template>
  <button
    type="button"
    class="favorite-button"
    :class="{ 'favorite-button--active': isFavorite }"
    :aria-pressed="isFavorite"
    :title="session.isAuthenticated ? (isFavorite ? 'Remove from favorites' : 'Add to favorites') : 'Log in to save favorites'"
    @click="handleClick"
  >
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        d="M6 3a2 2 0 0 0-2 2v16l8-4.5L20 21V5a2 2 0 0 0-2-2z"
        :fill="isFavorite ? 'currentColor' : 'none'"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>

<style scoped>
.favorite-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  border: none;
  background: rgba(8, 6, 13, 0.55);
  color: white;
  cursor: pointer;
  backdrop-filter: blur(2px);
}

.favorite-button--active {
  color: var(--accent, #aa3bff);
  background: rgba(255, 255, 255, 0.92);
}

.favorite-button:hover {
  background: rgba(8, 6, 13, 0.75);
}

.favorite-button--active:hover {
  background: white;
}
</style>
