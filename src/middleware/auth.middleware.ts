import { NextFunction, Request, RequestHandler, Response } from 'express'
import { verifyAuthJwt } from '../utils/jsonwebtoken.utils'
import { AuthLocals } from '../types/auth_locals'

export function requireAuthMiddleware(
    req: Request,
    res: Response<any, AuthLocals>,
    next: NextFunction
) {
    const token = req.headers.authorization?.split(' ')[1]

    const jwtVerification = verifyAuthJwt(token ?? '')

    if (jwtVerification.expired) //token expired
    {
        res.status(401).send({ error: 'Expired session' })
        return
    }

    if (!jwtVerification.payload) //token invalid
    {
        res.status(401).send({ error: 'Invalid session' })
        return
    }

    res.locals.userId = jwtVerification.payload!.id

    next()
}
