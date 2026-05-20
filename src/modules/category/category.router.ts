import { Router } from 'express'
import { createCategory } from './category.controller'
import { requireAuthMiddleware } from '../../middleware/auth.middleware'

const router = Router()

router.post('/', requireAuthMiddleware, createCategory)

export default router
