import { Router } from 'express'
import { deleteUser, login, signup } from './auth.controller'
import { requireAuthMiddleware } from '../../middleware/auth.middleware'

const router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.delete('/', requireAuthMiddleware, deleteUser)

export default router
