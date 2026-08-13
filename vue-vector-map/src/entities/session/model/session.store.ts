import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import * as sessionApi from '../api/sessionApi'
import type { Role, User } from './session.types'

type Status = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

export const useSessionStore = defineStore('session', () => {
  const user = ref<User | null>(null)
  const status = ref<Status>('idle')

  const isAuthenticated = computed(() => status.value === 'authenticated')

  function setUser(nextUser: User): void {
    user.value = nextUser
    status.value = 'authenticated'
  }

  function clear(): void {
    user.value = null
    status.value = 'unauthenticated'
  }

  function hasRole(...roles: Role[]): boolean {
    return user.value !== null && roles.includes(user.value.role)
  }

  // Restores session once per app lifetime (idempotent - safe to call from
  // every navigation guard run without re-hitting the network each time).
  let restorePromise: Promise<void> | null = null

  function ensureRestored(): Promise<void> {
    if (status.value !== 'idle') {
      return restorePromise ?? Promise.resolve()
    }
    status.value = 'loading'
    restorePromise = sessionApi
      .me()
      .then((restoredUser) => {
        setUser(restoredUser)
      })
      .catch(() => {
        clear()
      })
    return restorePromise
  }

  return { user, status, isAuthenticated, setUser, clear, hasRole, ensureRestored }
})
