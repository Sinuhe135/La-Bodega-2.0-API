import { Request, Response } from 'express-serve-static-core'
import * as authService from './auth.service'
import { LoginDto } from './dtos/login.dto'
import { LoginResponseDto } from './dtos/login_response.dto'
import { ErrorResponseDto } from '../../types/error_response.dto'
import { AppError } from '../../utils/app_error.utils'

export async function signup(
    req: Request<{}, {}, LoginDto>,
    res: Response<LoginResponseDto | ErrorResponseDto>
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

        res.status(500).send({ error: 'Internal server error' })
    }
}

export async function login(
    req: Request<{}, {}, LoginDto>,
    res: Response<LoginResponseDto | ErrorResponseDto>
) {
    try {
        const jwt = await authService.login(req.body.username, req.body.keyHash)
        res.status(200).send({ jwt: jwt })
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ error: error.message })
            return
        }

        res.status(500).send({ error: 'Internal server error' })
    }
}
