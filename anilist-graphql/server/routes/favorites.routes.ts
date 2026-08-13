import { Router } from 'express'
import * as favoritesController from '../controllers/favorites.controller.js'
import { requireAuth } from '../middlewares/requireAuth.js'

export const favoritesRouter = Router()

favoritesRouter.use(requireAuth)
favoritesRouter.get('/', favoritesController.list)
favoritesRouter.post('/', favoritesController.add)
favoritesRouter.delete('/:animeId', favoritesController.remove)
