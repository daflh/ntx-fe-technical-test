<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { sessionApi, useSessionStore } from '@/entities/session'
import { useFavoriteStore } from '@/entities/favorite'

const router = useRouter()
const session = useSessionStore()
const favorites = useFavoriteStore()
const loggingOut = ref(false)

async function handleLogout(): Promise<void> {
  loggingOut.value = true
  try {
    await sessionApi.logout()
  } finally {
    session.clear()
    favorites.clear()
    loggingOut.value = false
    await router.push({ name: 'search' })
  }
}
</script>

<template>
  <button type="button" class="logout-button" :disabled="loggingOut" @click="handleLogout">
    {{ loggingOut ? 'Signing out...' : 'Log out' }}
  </button>
</template>

<style scoped>
.logout-button {
  border: 1px solid var(--border, #cbd5e1);
  background: var(--bg, white);
  color: var(--text-h, #08060d);
  border-radius: 0.375rem;
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
  cursor: pointer;
}

.logout-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
