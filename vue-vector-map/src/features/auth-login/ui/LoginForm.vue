<script setup lang="ts">
import { useLoginForm } from '../model/useLoginForm'

const { username, password, submitting, submitError, submit, fillDemoUser } = useLoginForm()
</script>

<template>
  <form class="login-form" @submit.prevent="submit">
    <div class="login-form__field">
      <label for="username">Username</label>
      <input id="username" v-model="username" type="text" autocomplete="username" :disabled="submitting" />
    </div>

    <div class="login-form__field">
      <label for="password">Password</label>
      <input id="password" v-model="password" type="password" autocomplete="current-password" :disabled="submitting" />
    </div>

    <p v-if="submitError" class="login-form__error" role="alert">{{ submitError }}</p>

    <button type="submit" class="login-form__submit" :disabled="submitting">
      {{ submitting ? 'Signing in...' : 'Sign in' }}
    </button>

    <div class="login-form__demo">
      <span>Demo accounts:</span>
      <button type="button" @click="fillDemoUser('admin')">admin</button>
      <button type="button" @click="fillDemoUser('viewer')">viewer</button>
    </div>
  </form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 320px;
}

.login-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.login-form__field label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
}

.login-form__field input {
  padding: 0.55rem 0.7rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 0.95rem;
}

.login-form__error {
  color: #b91c1c;
  font-size: 0.85rem;
  margin: 0;
}

.login-form__submit {
  padding: 0.6rem;
  border: none;
  border-radius: 0.5rem;
  background: #2563eb;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.login-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-form__demo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #64748b;
}

.login-form__demo button {
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  border-radius: 0.375rem;
  padding: 0.15rem 0.5rem;
  cursor: pointer;
  font-size: 0.78rem;
}
</style>
