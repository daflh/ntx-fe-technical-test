import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { installAuthGuard } from './guards'

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

installAuthGuard(router)
