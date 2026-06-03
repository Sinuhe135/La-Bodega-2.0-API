import { Request, Response } from 'express-serve-static-core'
import { ErrorResponse } from '../../types/error_response'
import { AuthLocals } from '../../types/auth_locals'
import { GetAllAccountsResponseDto } from './dtos/get_all_accounts_response.dto'
import { CreateAccountDto } from './dtos/create_account.dto'
import { CreateAccountResponseDto } from './dtos/create_account_response.dto'
import { AppError } from '../../utils/app_error.utils'
import { PaginationParams } from '../../types/pagination_params'
import * as accountService from './account.service'
import { CategoryParamDto } from './dtos/category_param.dto'

export async function getAllAccountsByCategory(
    req: Request<CategoryParamDto, {}, {}, PaginationParams>,
    res: Response<GetAllAccountsResponseDto[] | ErrorResponse, AuthLocals>
) {
    try {
        const { page, limit } = req.query
        const categoryId = req.params.categoryId ? parseInt(req.params.categoryId) : undefined

        const accounts = await accountService.getAllAccountsByCategory(res.locals.userId, categoryId, page, limit)
        res.status(200).send(accounts)
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

export async function createAccount(
    req: Request<{}, {}, CreateAccountDto>,
    res: Response<CreateAccountResponseDto | ErrorResponse, AuthLocals>
) {
    try {
        const { name, username, email, password, platform, categoryId } = req.body
        const accountId = await accountService.createAccount(
            name,
            username,
            email,
            password,
            platform,
            categoryId,
            res.locals.userId
        )

        res.status(201).send({ id: accountId })
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
