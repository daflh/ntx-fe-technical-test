import type { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '../lib/tokens.js'

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.access_token as string | undefined

  if (!token) {
    res.status(401).json({ message: 'Not authenticated.' })
    return
  }

  try {
    req.user = verifyAccessToken(token)
    next()
  } catch {
    res.status(401).json({ message: 'Access token invalid or expired.' })
  }
}
