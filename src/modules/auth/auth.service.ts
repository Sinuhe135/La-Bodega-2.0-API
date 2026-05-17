import { generateAccessToken } from '../../utils/jsonwebtoken.utils'
import bcrypt from 'bcrypt'
import { insertUser, selectAuthByUsername } from './auth.repository'
import { AppError } from '../../utils/app_error.utils'

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

    const jwtPayload = {
        id: id,
    }

    const jwt = generateAccessToken(jwtPayload)
    return jwt
}

export async function login(keyHash: string): Promise<string> {
    return 'of'
}

async function hashText(text: string): Promise<string> {
    const salt = await bcrypt.genSalt()
    return await bcrypt.hash(text, salt)
}
