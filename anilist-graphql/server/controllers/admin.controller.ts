import type { Request, Response } from 'express'
import { demoUsers } from '../data/demoUsers.js'
import { countAllFavorites } from '../data/favoritesStore.js'

export function stats(req: Request, res: Response): void {
  res.status(200).json({
    message: `Welcome, ${req.user!.username}.`,
    role: req.user!.role,
    serverTime: new Date().toISOString(),
    totalUsers: demoUsers.length,
    totalFavorites: countAllFavorites(),
  })
}
