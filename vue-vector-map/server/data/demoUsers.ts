export type Role = 'admin' | 'viewer'

export interface DemoUser {
  id: number
  username: string
  password: string
  role: Role
}

// DEMO ONLY: plaintext credentials in source. Never do this in a real backend -
// passwords must be hashed (e.g. bcrypt/argon2) and stored in a real user store.
export const demoUsers: DemoUser[] = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, username: 'viewer', password: 'viewer123', role: 'viewer' },
]

export function findUserByCredentials(username: string, password: string): DemoUser | undefined {
  return demoUsers.find((u) => u.username === username && u.password === password)
}

export function findUserById(id: number): DemoUser | undefined {
  return demoUsers.find((u) => u.id === id)
}
