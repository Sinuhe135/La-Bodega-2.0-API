import { Request, Response } from 'express-serve-static-core'
import * as groupsService from './category.service'
import { CreateCategoryDto } from './dtos/create_category.dto'
import { CreateCategoryResponseDto } from './dtos/create_category_reponse.dto'
import { GetAllCategoriesResponseDto } from './dtos/get_all_categories_response.dto'
import { AppError } from '../../utils/app_error.utils'
import { ErrorResponse } from '../../types/error_response'
import { AuthLocals } from '../../types/auth_locals'

export async function getAllCategories(
    req: Request,
    res: Response<GetAllCategoriesResponseDto[] | ErrorResponse, AuthLocals>
) {
    try {
        const categories = await groupsService.getAllCategories(res.locals.userId)
        res.status(200).send(categories)
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ error: error.message })
            return
        }

        console.log(`There was an error with ${req.method} ${req.originalUrl}`)
        console.log(error)
        res.status(500).send({ error: 'Internal server error' })
    }
}

export async function createCategory(
    req: Request<{}, {}, CreateCategoryDto>,
    res: Response<CreateCategoryResponseDto | ErrorResponse, AuthLocals>
) {
    try {
        const category = await groupsService.createCategory(
            req.body.name,
            res.locals.userId
        )
        res.status(201).send(category)
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ error: error.message })
            return
        }

        console.log(`There was an error with ${req.method} ${req.originalUrl}`)
        console.log(error)
        res.status(500).send({ error: 'Internal server error' })
    }
}
