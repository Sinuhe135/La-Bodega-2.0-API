import { generateAccessToken } from '../../utils/jsonwebtoken.utils'
import { insertUser, selectAuthByUsername } from './auth.repository'
import { AppError } from '../../utils/app_error.utils'
import { hashText, verifyHash } from '../../utils/hash.utils'

export async function signup(
    username: string,
    keyHash: string
): Promise<string> {
    const existingAuth = await selectAuthByUsername(username)
    if (existingAuth) {
        throw new AppError(400, 'Username already exists')
    }

    const doubleKeyHash = await hashText(keyHash)
    const id = await insertUser(username, doubleKeyHash)

    const jwt = generateAccessToken({ id: id })
    return jwt
}

export async function login(
    username: string,
    keyHash: string
): Promise<string> {
    const auth = await selectAuthByUsername(username)
    if (!auth) {
        throw new AppError(401, 'Invalid username or key')
    }

    const isKeyValid = await verifyHash(keyHash, auth.keyHash)
    if (!isKeyValid) {
        throw new AppError(401, 'Invalid username or key')
    }

    const jwt = generateAccessToken({ id: auth.id })
    return jwt
}
