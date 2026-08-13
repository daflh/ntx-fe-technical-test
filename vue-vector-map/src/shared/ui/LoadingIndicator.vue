<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), {
  label: 'Loading...',
})
</script>

<template>
  <div class="loading-indicator" role="status">
    <span class="loading-indicator__spinner" aria-hidden="true" />
    <span>{{ label }}</span>
  </div>
</template>

<style scoped>
.loading-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-muted, #64748b);
  font-size: 0.9rem;
}

.loading-indicator__spinner {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-top-color: transparent;
  animation: loading-indicator-spin 0.7s linear infinite;
}

@keyframes loading-indicator-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
