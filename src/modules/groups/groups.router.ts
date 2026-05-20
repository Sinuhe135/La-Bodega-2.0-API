import { Router } from 'express'
import { createGroup } from './groups.controller'
import { requireAuthMiddleware } from '../../middleware/auth.middleware'

const router = Router()

router.post('/', requireAuthMiddleware, createGroup)

export default router
