import { Request, Response } from 'express'
import * as authService from './auth.service'

export function login(req: Request, res: Response) {
    authService.login()

    res.send('Login')
}
