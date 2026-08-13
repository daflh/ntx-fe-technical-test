<script setup lang="ts">
import { useSessionStore } from '@/entities/session'
import LogoutButton from '@/features/auth-logout/ui/LogoutButton.vue'

const session = useSessionStore()
</script>

<template>
  <header class="app-header">
    <div class="app-header__brand">
      <span class="app-header__logo" aria-hidden="true">&#128278;</span>
      <span>AniSearch</span>
    </div>

    <nav class="app-header__nav">
      <RouterLink to="/" class="app-header__link">Search</RouterLink>
      <RouterLink to="/favorites" class="app-header__link">Favorites</RouterLink>
      <RouterLink v-if="session.hasRole('admin')" to="/admin" class="app-header__link">Admin</RouterLink>
    </nav>

    <div v-if="session.user" class="app-header__user">
      <span class="app-header__badge">{{ session.user.username }} &middot; {{ session.user.role }}</span>
      <LogoutButton />
    </div>
    <RouterLink v-else to="/login" class="app-header__login">Log in</RouterLink>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 1rem;
  border-bottom: 1px solid var(--border, #e5e4e7);
  background: var(--bg, white);
  flex-wrap: wrap;
}

.app-header__brand {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 700;
  color: var(--text-h, #08060d);
  font-size: 1rem;
}

.app-header__nav {
  display: flex;
  gap: 0.75rem;
  flex: 1;
}

.app-header__link {
  color: var(--text, #475569);
  text-decoration: none;
  font-size: 0.9rem;
  padding: 0.25rem 0.4rem;
  border-radius: 0.375rem;
}

.app-header__link.router-link-exact-active {
  color: var(--accent, #aa3bff);
  background: var(--accent-bg, #eff6ff);
  font-weight: 600;
}

.app-header__user {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.app-header__badge {
  font-size: 0.8rem;
  color: var(--text, #64748b);
  white-space: nowrap;
}

.app-header__login {
  font-size: 0.85rem;
  color: var(--accent, #aa3bff);
  text-decoration: none;
  font-weight: 600;
}

@media (max-width: 640px) {
  .app-header {
    gap: 0.5rem;
  }

  .app-header__badge {
    display: none;
  }
}
</style>
