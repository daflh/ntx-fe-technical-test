<script setup lang="ts"></script>

<template>
  <div class="status-page">
    <h1>404 &mdash; Not found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <RouterLink to="/">Back to search</RouterLink>
  </div>
</template>

<style scoped>
.status-page {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-align: center;
  padding: 1rem;
}

.status-page h1 {
  color: var(--text-h, #0f172a);
}

.status-page p {
  color: var(--text, #64748b);
}
</style>
