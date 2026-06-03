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
