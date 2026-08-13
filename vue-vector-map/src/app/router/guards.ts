import type { Router } from 'vue-router'
import { useSessionStore } from '@/entities/session'

export function installAuthGuard(router: Router): void {
  router.beforeEach(async (to) => {
    const session = useSessionStore()
    await session.ensureRestored()

    const isAuthenticated = session.status === 'authenticated'

    // Already logged in and heading to /login -> no need to log in again.
    if (to.name === 'login' && isAuthenticated) {
      return { name: 'map' }
    }

    if (to.meta.requiresAuth && !isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (to.meta.roles && !session.hasRole(...to.meta.roles)) {
      return { name: 'forbidden' }
    }

    return true
  })
}
