import { ResultSetHeader } from 'mysql2'
import pool from '../../config/database'
import { AccountRow } from './row_types/account.row'

export async function selectAllAccountsByCategoryId(
    categoryId: number,
    limit: number,
    offset: number
): Promise<AccountRow[]> {
    const [results] = await pool.query<AccountRow[]>(
        'select id, name, username, email, password, platform, creationDate, lastModifiedDate, categoryId from ACCOUNT where categoryId = ? AND deleted = 0 LIMIT ? OFFSET ?',
        [categoryId, limit, offset]
    )
    return results
}

export async function insertAccount(
    name: string,
    username: string,
    email: string,
    password: string,
    platform: string,
    categoryId: number
): Promise<number> {
    const [results] = await pool.query<ResultSetHeader>(
        'insert into ACCOUNT (name, username, email, password, platform, categoryId) values (?, ?, ?, ?, ?, ?)',
        [name, username, email, password, platform, categoryId]
    )
    return results.insertId
}
