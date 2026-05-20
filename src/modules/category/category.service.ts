import { insertCategory } from './category.repository'
import { CreateCategoryResponseDto } from './dtos/create_category_reponse.dto'

export async function createCategory(
    name: string,
    userId: number
): Promise<CreateCategoryResponseDto> {
    const id = await insertCategory(name, userId)
    return { id }
}
