import jwt from 'jsonwebtoken'
import env from '../config/env'
import { JwtVerification } from '../types/jwt_verification'
import { AuthJwtPayloadDto } from '../modules/auth/dtos/auth_jwt_payload.dto'

export function generateAuthJwt(data: AuthJwtPayloadDto): string {
    return jwt.sign(data, env.JWT_KEY, { expiresIn: 3600 }) // 1 hour
}

export function verifyAuthJwt(token: string): JwtVerification {
    try {
        const decoded = jwt.verify(token, env.JWT_KEY)
        const payload = mapAuthPayload(decoded)

        return { payload: payload, expired: false }
    } catch (error) {
        if (
            error instanceof jwt.JsonWebTokenError &&
            error.name === 'TokenExpiredError'
        ) {
            return { payload: null, expired: true }
        } else {
            return { payload: null, expired: false }
        }
    }
}

function mapAuthPayload(payload: jwt.JwtPayload | string): AuthJwtPayloadDto {
    if (typeof payload === 'string') {
        throw new Error('Invalid JWT payload')
    }

    if (typeof payload.id !== 'number') {
        throw new Error('Invalid JWT payload: missing id')
    }

    return {
        id: payload.id,
    }
}
