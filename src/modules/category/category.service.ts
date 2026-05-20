import { insertCategory, selectAllCategoriesByUserId } from './category.repository'
import { CreateCategoryResponseDto } from './dtos/create_category_reponse.dto'
import { GetAllCategoriesResponseDto } from './dtos/get_all_categories_response.dto'

export async function createCategory(
    name: string,
    userId: number
): Promise<CreateCategoryResponseDto> {
    const id = await insertCategory(name, userId)
    return { id }
}

export async function getAllCategories(
    userId: number
): Promise<GetAllCategoriesResponseDto[]> {
    const rows = await selectAllCategoriesByUserId(userId)
    return rows.map(({ id, name }) => ({ id, name }))
}
