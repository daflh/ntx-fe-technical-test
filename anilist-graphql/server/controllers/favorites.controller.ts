import type { Request, Response } from 'express'
import { addFavorite, listFavorites, removeFavorite } from '../data/favoritesStore.js'

export function list(req: Request, res: Response): void {
  res.status(200).json(listFavorites(req.user!.sub))
}

export function add(req: Request, res: Response): void {
  const { animeId } = req.body ?? {}
  if (typeof animeId !== 'number') {
    res.status(400).json({ message: 'animeId (number) is required.' })
    return
  }
  addFavorite(req.user!.sub, animeId)
  res.status(200).json({ ok: true })
}

export function remove(req: Request, res: Response): void {
  const animeId = Number(req.params.animeId)
  if (!Number.isFinite(animeId)) {
    res.status(400).json({ message: 'Invalid animeId.' })
    return
  }
  removeFavorite(req.user!.sub, animeId)
  res.status(204).end()
}
