import type { Request, Response } from 'express'

export function stats(req: Request, res: Response): void {
  res.status(200).json({
    message: `Welcome, ${req.user!.username}.`,
    role: req.user!.role,
    serverTime: new Date().toISOString(),
  })
}
