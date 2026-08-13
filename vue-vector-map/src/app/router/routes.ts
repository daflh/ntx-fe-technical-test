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
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/LoginPage.vue'),
  },
  {
    path: '/',
    name: 'map',
    component: () => import('@/pages/map/MapPage.vue'),
    meta: { requiresAuth: true },
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
