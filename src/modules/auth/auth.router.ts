import { Router } from 'express'
import { getCurrentUser, login, signup } from './auth.controller'
import { requireAuthMiddleware } from '../../middleware/auth.middleware'

const router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/check', requireAuthMiddleware, getCurrentUser)

export default router
