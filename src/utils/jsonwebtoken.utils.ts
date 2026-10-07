import jwt from 'jsonwebtoken'
import env from '../config/env'
import { AuthJwtPayloadDto } from '../modules/auth/dtos/auth_jwt_payload.dto'
import { AppError } from './app_error.utils'

const jwtExpirationTime = 3600 // 1 hour in seconds

export function generateAuthJwt(data: AuthJwtPayloadDto): string {
    return jwt.sign(data, env.JWT_KEY, { expiresIn: jwtExpirationTime })
}

export function getJwtPayload(token: string): AuthJwtPayloadDto {
    try {
        const decoded = jwt.verify(token, env.JWT_KEY)
        const payload = mapAuthPayload(decoded)
        return payload
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError && error.name === 'TokenExpiredError') {
            throw new AppError(401, 'Expired session')
        } else {
            throw new AppError(401, 'Invalid session')
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
