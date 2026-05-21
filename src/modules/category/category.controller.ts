import { Request, Response } from 'express-serve-static-core'
import { CreateCategoryDto } from './dtos/create_category.dto'
import { CreateCategoryResponseDto } from './dtos/create_category_reponse.dto'
import { GetAllCategoriesResponseDto } from './dtos/get_all_categories_response.dto'
import { ErrorResponse } from '../../types/error_response'
import { AuthLocals } from '../../types/auth_locals'

export async function getAllCategories(
    req: Request,
    res: Response<GetAllCategoriesResponseDto[] | ErrorResponse, AuthLocals>
) {
    res.status(200).send([
        { id: 1, name: 'Personal' },
        { id: 2, name: 'ITJ' },
        { id: 3, name: 'Xipal' },
    ])
}

export async function createCategory(
    req: Request<{}, {}, CreateCategoryDto>,
    res: Response<CreateCategoryResponseDto | ErrorResponse, AuthLocals>
) {
    res.status(201).send({ id: 1 })
}
