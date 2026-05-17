import jwt from 'jsonwebtoken'
import env from '../config/env'
import { JwtPayloadDto } from '../modules/auth/dtos/jwt_payload.dto'

export function generateAccessToken(data: JwtPayloadDto) {
    return jwt.sign(data, env.JWT_KEY, { expiresIn: 3600 }) // 1 hour
}
