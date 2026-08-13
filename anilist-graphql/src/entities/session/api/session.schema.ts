import { z } from 'zod'

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  role: z.enum(['admin', 'viewer']),
})
