export type Role = 'admin' | 'viewer'

export interface User {
  id: number
  username: string
  role: Role
}
