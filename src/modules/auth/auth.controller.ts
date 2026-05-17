import { Request, Response } from 'express-serve-static-core'
import * as authService from './auth.service'
import { LoginDto } from './dtos/login.dto'
import { LoginResponseDto } from './dtos/login-response.dto'

export async function login(
    req: Request<{}, {}, LoginDto>,
    res: Response<LoginResponseDto>
) {
    const jwt = await authService.login(req.body.keyHash)

    res.status(200).send({ jwt: jwt })
}
