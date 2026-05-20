import { ResultSetHeader } from 'mysql2'
import pool from '../../config/database'
import { CategoryRow } from './row_types/category.row'

export async function insertCategory(
    name: string,
    userId: number
): Promise<number> {
    const [results] = await pool.query<ResultSetHeader>(
        'insert into CATEGORY (name, userId) values (?, ?)',
        [name, userId]
    )
    return results.insertId
}

export async function selectAllCategoriesByUserId(
    userId: number
): Promise<CategoryRow[]> {
    const [results] = await pool.query<CategoryRow[]>(
        'select id, name, userId, deleted from CATEGORY where userId = ? AND deleted = 0',
        [userId]
    )
    return results
}
