import { AuthJwtPayloadDto } from '../modules/auth/dtos/auth_jwt_payload.dto'

export interface JwtVerification {
    payload: AuthJwtPayloadDto | null
    expired: boolean
}
