import { authorizedHttp } from '@/shared/api/authorizedHttp'

export interface AdminStats {
  message: string
  role: string
  serverTime: string
  totalUsers: number
  totalFavorites: number
}

export function fetchAdminStats(): Promise<AdminStats> {
  return authorizedHttp.get<AdminStats>('/api/admin/stats')
}
