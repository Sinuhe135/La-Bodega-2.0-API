import { ResultSetHeader } from 'mysql2'
import pool from '../../config/database'

export async function insertGroup(
    name: string,
    userId: number
): Promise<number> {
    const [results] = await pool.query<ResultSetHeader>(
        'insert into CATEGORY (name, userId) values (?, ?)',
        [name, userId]
    )
    return results.insertId
}
