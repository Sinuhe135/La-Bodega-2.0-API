import { Request, Response } from 'express-serve-static-core'
import * as groupsService from './category.service'
import { CreateCategoryDto } from './dtos/create_category.dto'
import { CreateCategoryResponseDto } from './dtos/create_category_reponse.dto'
import { AppError } from '../../utils/app_error.utils'
import { ErrorResponse } from '../../types/error_response'
import { AuthLocals } from '../../types/auth_locals'

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
