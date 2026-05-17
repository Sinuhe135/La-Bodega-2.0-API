import { createUser, getAllUsers } from './auth.repository'

export async function login(keyHash: string): Promise<string> {
    console.log('Login')

    await createUser(keyHash)

    const users = await getAllUsers()
    users.forEach((user) => {
        console.log(user.id)
    })

    const response = `Key hash: ${keyHash}`
    return response
}
