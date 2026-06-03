import { Router } from 'express'
import { requireAuthMiddleware } from '../../middleware/auth.middleware'
import { createAccount, getAllAccountsByCategory } from './account.controller'

const router = Router()

router.get('/all/:categoryId', requireAuthMiddleware, getAllAccountsByCategory)
router.post('/', requireAuthMiddleware, createAccount)

export default router
