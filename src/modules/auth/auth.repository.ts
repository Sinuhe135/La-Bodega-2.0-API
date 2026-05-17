import { ResultSetHeader } from 'mysql2'
import pool from '../../config/database'

export async function createUser(keyHash: string): Promise<number> {
    const conn = await pool.getConnection()
    try {
        await conn.beginTransaction()

        const [result] = await conn.query<ResultSetHeader>(
            'insert into USER () values ()'
        )
        await conn.query<ResultSetHeader>(
            `insert into AUTH (id,keyHash) values (?,?)`,
            [result.insertId, keyHash]
        )

        await conn.commit()
        conn.release()

        return result.insertId
    } catch (error) {
        await conn.rollback()
        conn.release()

        throw error
    }
}

// export async function getAllUsers(): Promise<UserRow[]> {
//     const [results, fields] = await pool.query<UserRow[]>('select * from USER')

//     return results
// }
