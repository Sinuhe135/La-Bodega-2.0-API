import { ResultSetHeader } from 'mysql2'
import pool from '../../config/database'
import { AuthRow } from './row_types/auth.row'

export async function selectAuthByUsername(
    username: string
): Promise<AuthRow | undefined> {
    const [results] = await pool.query<AuthRow[]>(
        'select id, username, keyHash from AUTH where username = ?',
        [username]
    )
    return results[0]
}

export async function insertUser(
    username: string,
    keyHash: string
): Promise<number> {
    const conn = await pool.getConnection()
    try {
        await conn.beginTransaction()

        const [result] = await conn.query<ResultSetHeader>(
            'insert into USER () values ()'
        )
        await conn.query<ResultSetHeader>(
            `insert into AUTH (id,username, keyHash) values (?,?,?)`,
            [result.insertId, username, keyHash]
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
