import { NextFunction, Request, Response } from 'express'
import { AuthLocals } from '../types/auth_locals'

export function requireAuthMiddleware(
    req: Request,
    res: Response<any, AuthLocals>,
    next: NextFunction
) {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        res.status(401).send({ error: 'No token provided' })
        return
    }

    res.locals.userId = 1

    next()
}
