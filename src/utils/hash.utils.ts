import bcrypt from 'bcrypt'

export async function hashText(text: string): Promise<string> {
    const salt = await bcrypt.genSalt()
    return await bcrypt.hash(text, salt)
}

export async function verifyHash(
    value: string,
    storedHash: string
): Promise<boolean> {
    return await bcrypt.compare(value, storedHash)
}
