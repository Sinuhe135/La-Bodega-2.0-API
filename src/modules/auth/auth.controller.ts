import { Request, Response } from 'express-serve-static-core'
import { LoginDto } from './dtos/login.dto'
import { LoginResponseDto } from './dtos/login_response.dto'
import { ErrorResponse } from '../../types/error_response'
import { AuthLocals } from '../../types/auth_locals'
import { CheckSessionResponseDto } from './dtos/check_session_response.dto'
import { CurrentUserResponseDto } from './dtos/current_user_response.dto'

export async function signup(
    req: Request<{}, {}, LoginDto>,
    res: Response<LoginResponseDto | ErrorResponse>
) {
    res.status(200).send({ jwt: 'hardcoded-jwt-token' })
}

export async function login(
    req: Request<{}, {}, LoginDto>,
    res: Response<LoginResponseDto | ErrorResponse>
) {
    res.status(200).send({ jwt: 'hardcoded-jwt-token' })
}

export function getCurrentUser(
    req: Request,
    res: Response<CheckSessionResponseDto, AuthLocals>
) {
    res.status(200).send({ id: 1 })
}

export async function currentUser(
    req: Request,
    res: Response<CurrentUserResponseDto | ErrorResponse, AuthLocals>
) {
    res.status(200).send({ id: 1, username: 'hardcoded-user' })
}
