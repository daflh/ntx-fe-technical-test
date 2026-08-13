import { Router } from 'express'
import * as adminController from '../controllers/admin.controller.js'
import { requireAuth } from '../middlewares/requireAuth.js'
import { requireRole } from '../middlewares/requireRole.js'

export const adminRouter = Router()

adminRouter.get('/stats', requireAuth, requireRole('admin'), adminController.stats)
