import { generateAccessToken } from '../../utils/jsonwebtoken.utils'
import { createUser } from './auth.repository'
import bcrypt from 'bcrypt'

export async function signup(keyHash: string): Promise<string> {
    const doubleKeyHash = await hashText(keyHash)
    const id = await createUser(doubleKeyHash)

    const jwtPayload = {
        id: id,
    }

    const jwt = generateAccessToken(jwtPayload) // 1 hour
    return jwt
}

export async function login(keyHash: string): Promise<string> {
    const doubleKeyHash = await hashText(keyHash)

    const id = await createUser(doubleKeyHash)

    // create jwt

    const jwt = `Key hash: ${keyHash}, User ID: ${id}`
    return jwt
}

async function hashText(text: string): Promise<string> {
    const salt = await bcrypt.genSalt()
    return await bcrypt.hash(text, salt)
}
