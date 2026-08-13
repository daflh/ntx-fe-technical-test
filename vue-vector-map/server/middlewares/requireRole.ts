import type { NextFunction, Request, Response } from 'express'
import type { Role } from '../data/demoUsers.js'

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden: insufficient role.' })
      return
    }
    next()
  }
}
