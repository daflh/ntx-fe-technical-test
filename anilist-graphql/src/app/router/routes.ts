import type { RouteRecordRaw } from 'vue-router'
import type { Role } from '@/entities/session'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    roles?: Role[]
  }
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'search',
    component: () => import('@/pages/search/SearchPage.vue'),
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('@/pages/favorites/FavoritesPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/LoginPage.vue'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/pages/admin/AdminPage.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/forbidden',
    name: 'forbidden',
    component: () => import('@/pages/forbidden/ForbiddenPage.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/not-found/NotFoundPage.vue'),
  },
]
