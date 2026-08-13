import type { App } from 'vue'
import { createPinia } from 'pinia'
import { router } from '../router'
import { useSessionStore } from '@/entities/session'
import { setUnauthorizedHandler } from '@/shared/api/authorizedHttp'

export function setupProviders(app: App): void {
  const pinia = createPinia()
  app.use(pinia)
  app.use(router)

  // Wires shared/api's refresh-failure callback to session+router without
  // shared/ importing entities/ or app/ directly (keeps FSD layering clean).
  const session = useSessionStore(pinia)
  setUnauthorizedHandler(() => {
    session.clear()
    if (router.currentRoute.value.name !== 'login') {
      router.push({ name: 'login' })
    }
  })
}
