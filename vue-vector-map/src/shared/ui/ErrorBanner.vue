<script setup lang="ts">
withDefaults(defineProps<{ message: string; retryable?: boolean }>(), {
  retryable: false,
})
const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="error-banner" role="alert">
    <span>{{ message }}</span>
    <button v-if="retryable" type="button" class="error-banner__retry" @click="emit('retry')">Retry</button>
  </div>
</template>

<style scoped>
.error-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.6rem 0.9rem;
  border-radius: 0.5rem;
  background: var(--color-danger-bg, #fef2f2);
  color: var(--color-danger-text, #b91c1c);
  border: 1px solid var(--color-danger-border, #fecaca);
  font-size: 0.9rem;
}

.error-banner__retry {
  flex-shrink: 0;
  border: 1px solid currentColor;
  background: transparent;
  color: inherit;
  border-radius: 0.375rem;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  cursor: pointer;
}

.error-banner__retry:hover {
  background: rgba(185, 28, 28, 0.08);
}
</style>
