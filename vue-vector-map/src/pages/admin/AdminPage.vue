<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSchools } from '@/entities/school'
import LoadingIndicator from '@/shared/ui/LoadingIndicator.vue'
import ErrorBanner from '@/shared/ui/ErrorBanner.vue'
import { fetchAdminStats, type AdminStats } from './api/adminApi'

const { schools } = useSchools()

const stats = ref<AdminStats | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

async function load(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    stats.value = await fetchAdminStats()
  } catch {
    error.value = 'Failed to load admin data.'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="admin-page">
    <h1>Admin panel</h1>
    <p class="admin-page__subtitle">This page is restricted to the <code>admin</code> role - it demonstrates RBAC, backed by a server-side protected endpoint.</p>

    <section class="admin-page__card">
      <h2>Server session check</h2>
      <LoadingIndicator v-if="loading" label="Loading admin data..." />
      <ErrorBanner v-else-if="error" :message="error" retryable @retry="load" />
      <dl v-else-if="stats" class="admin-page__stats">
        <div>
          <dt>Message</dt>
          <dd>{{ stats.message }}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{{ stats.role }}</dd>
        </div>
        <div>
          <dt>Server time</dt>
          <dd>{{ stats.serverTime }}</dd>
        </div>
      </dl>
    </section>

    <section class="admin-page__card">
      <h2>Dataset overview</h2>
      <p>{{ schools.length }} schools currently loaded from the public locations API.</p>
    </section>
  </div>
</template>

<style scoped>
.admin-page {
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.admin-page h1 {
  margin: 0 0 0.25rem;
  color: #0f172a;
}

.admin-page__subtitle {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0 0 1.5rem;
}

.admin-page__card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.admin-page__card h2 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  color: #0f172a;
}

.admin-page__stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
}

.admin-page__stats dt {
  font-size: 0.72rem;
  text-transform: uppercase;
  color: #94a3b8;
}

.admin-page__stats dd {
  margin: 0;
  font-size: 0.9rem;
  color: #1e293b;
}
</style>
