import { PaginatedResult } from '../../types/pagination'
import { AppError } from '../../utils/app_error.utils'
import { selectCategoryById } from '../category/category.repository'
import { countAccountsByCategoryId, insertAccount, selectAllAccountsByCategoryId } from './account.repository'
import { CreateAccountResponseDto } from './dtos/create_account_response.dto'
import { GetAllAccountsResponseDto } from './dtos/get_all_accounts_response.dto'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

export async function getAllAccountsByCategory(
    userId: number,
    categoryId: number | undefined,
    page: string | undefined,
    limit: string | undefined
): Promise<PaginatedResult<GetAllAccountsResponseDto>> {
    if (categoryId == undefined) {
        throw new AppError(400, 'Category ID is required')
    }

    const category = await selectCategoryById(categoryId, userId)
    if (!category) {
        throw new AppError(404, 'Category not found')
    }

    const parsedPage = page ? parseInt(page) : DEFAULT_PAGE
    let parsedLimit = limit ? parseInt(limit) : DEFAULT_LIMIT
    if (parsedLimit > 100) {
        parsedLimit = 100
    }

    const offset = (parsedPage - 1) * parsedLimit

    const [rows, totalAccounts] = await Promise.all([
        selectAllAccountsByCategoryId(category.id, parsedLimit, offset),
        countAccountsByCategoryId(category.id),
    ])
    return {
        data: rows.map(
            ({ id, name, username, email, password, platform, creationDate, lastModifiedDate, groupId }) => ({
                id,
                name,
                username,
                email,
                password,
                platform,
                creationDate,
                lastModifiedDate,
                groupId,
            })
        ),
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(totalAccounts / parsedLimit),
    }
}

export async function createAccount(
    name: string,
    username: string,
    email: string,
    password: string,
    platform: string,
    categoryId: number,
    userId: number
): Promise<number> {
    const category = await selectCategoryById(categoryId, userId)
    if (!category) {
        throw new AppError(404, 'Category not found')
    }

    const id = await insertAccount(name, username, email, password, platform, categoryId)
    return id
}
