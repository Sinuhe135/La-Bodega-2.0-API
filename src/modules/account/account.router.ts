import { Router } from 'express'
import { requireAuthMiddleware } from '../../middleware/auth.middleware'
import { getAllAccountsByCategory } from './account.controller'

const router = Router()

router.get('/all/:categoryId', requireAuthMiddleware, getAllAccountsByCategory)

export default router
