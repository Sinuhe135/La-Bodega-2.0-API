import { Router } from 'express'
import { currentUser, getCurrentUser, login, signup } from './auth.controller'
import { requireAuthMiddleware } from '../../middleware/auth.middleware'

const router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/check', requireAuthMiddleware, getCurrentUser)
router.get('/current', requireAuthMiddleware, currentUser)

export default router
