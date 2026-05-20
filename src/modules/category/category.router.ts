import { Router } from 'express'
import { createCategory, getAllCategories } from './category.controller'
import { requireAuthMiddleware } from '../../middleware/auth.middleware'

const router = Router()

router.get('/all', requireAuthMiddleware, getAllCategories)
router.post('/', requireAuthMiddleware, createCategory)

export default router
