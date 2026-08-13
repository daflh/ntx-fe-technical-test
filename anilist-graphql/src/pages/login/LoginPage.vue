<script setup lang="ts">
import LoginForm from '@/features/auth-login/ui/LoginForm.vue'
</script>

<template>
  <div class="login-page">
    <div class="login-page__card">
      <h1>Sign in</h1>
      <p class="login-page__subtitle">AniSearch &mdash; AniList-powered anime search.</p>
      <LoginForm />
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--code-bg, #f8fafc);
  padding: 1rem;
  box-sizing: border-box;
}

.login-page__card {
  background: var(--bg, white);
  border: 1px solid var(--border, transparent);
  border-radius: 0.75rem;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  width: 100%;
  max-width: 360px;
  box-sizing: border-box;
}

.login-page__card h1 {
  margin: 0;
  font-size: 1.3rem;
  color: var(--text-h, #08060d);
}

.login-page__subtitle {
  margin: 0 0 1rem;
  font-size: 0.85rem;
  color: var(--text, #64748b);
  text-align: center;
}
</style>
