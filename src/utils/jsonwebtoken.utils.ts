import jwt from 'jsonwebtoken'
import env from '../config/env'

export function generateAccessToken(data: object) {
    return jwt.sign(data, env.JWT_KEY, { expiresIn: 3600 }) // 1 hour
}
