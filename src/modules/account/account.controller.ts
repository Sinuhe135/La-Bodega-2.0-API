import { Request, Response } from 'express-serve-static-core'
import { ErrorResponse } from '../../types/error_response'
import { AuthLocals } from '../../types/auth_locals'
import { GetAllAccountsResponseDto } from './dtos/get_all_accounts_response.dto'
import { AppError } from '../../utils/app_error.utils'
import { PaginationParams } from '../../types/pagination_params'

export async function getAllAccounts(
    req: Request<{}, {}, {}, PaginationParams>,
    res: Response<GetAllAccountsResponseDto[] | ErrorResponse, AuthLocals>
) {
    try {
        const { page, limit } = req.query
        res.status(200).send([])
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
