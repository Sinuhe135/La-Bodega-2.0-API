import { ResultSetHeader } from 'mysql2'
import pool from '../../config/database'
import { UserRow } from './row_types/user.row'

export async function createUser(keyHash: string) {
    const [results, fields] = await pool.query<ResultSetHeader>(
        'insert into USER values ()'
    )
}

export async function getAllUsers(): Promise<UserRow[]> {
    const [results, fields] = await pool.query<UserRow[]>('select * from USER')

    return results
}
