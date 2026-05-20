import { Request, Response } from 'express-serve-static-core'
import * as authService from './auth.service'
import { LoginDto } from './dtos/login.dto'
import { LoginResponseDto } from './dtos/login_response.dto'
import { AppError } from '../../utils/app_error.utils'
import { ErrorResponse } from '../../types/error_response'
import { AuthLocals } from '../../types/auth_locals'
import { CheckSessionResponseDto } from './dtos/check_session_response.dto'
import { CurrentUserResponseDto } from './dtos/current_user_response.dto'

export async function signup(
    req: Request<{}, {}, LoginDto>,
    res: Response<LoginResponseDto | ErrorResponse>
) {
    try {
        const jwt = await authService.signup(
            req.body.username,
            req.body.keyHash
        )
        res.status(200).send({ jwt: jwt })
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ error: error.message })
            return
        }

        console.log(`There was an error with ${req.method} ${req.originalUrl}`)
        console.log(error)
        res.status(500).send({ error: 'Internal server error' })
    }
}

export async function login(
    req: Request<{}, {}, LoginDto>,
    res: Response<LoginResponseDto | ErrorResponse>
) {
    try {
        const jwt = await authService.login(req.body.username, req.body.keyHash)
        res.status(200).send({ jwt: jwt })
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ error: error.message })
            return
        }

        console.log(`There was an error with ${req.method} ${req.originalUrl}`)
        console.log(error)
        res.status(500).send({ error: 'Internal server error' })
    }
}

export function getCurrentUser(
    req: Request,
    res: Response<CheckSessionResponseDto, AuthLocals>
) {
    res.status(200).send({ id: res.locals.userId })
}

export async function currentUser(
    req: Request,
    res: Response<CurrentUserResponseDto | ErrorResponse, AuthLocals>
) {
    try {
        const user = await authService.getAuth(res.locals.userId)
        res.status(200).send(user)
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ error: error.message })
            return
        }

        console.log(`There was an error with ${req.method} ${req.originalUrl}`)
        console.log(error)
        res.status(500).send({ error: 'Internal server error' })
    }
}
