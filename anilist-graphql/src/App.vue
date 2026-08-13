<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { AppHeader } from '@/widgets/app-header'

const route = useRoute()
const showHeader = computed(() => route.name !== 'login')
</script>

<template>
  <div class="app-shell">
    <AppHeader v-if="showHeader" />
    <main class="app-shell__main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.app-shell__main {
  flex: 1;
  min-height: 0;
}
</style>
