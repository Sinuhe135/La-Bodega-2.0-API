import { APIGatewayProxyHandlerV2 } from 'aws-lambda'

import * as accountService from '../../modules/account/account.service'
import { CategoryParamDto } from '../../modules/account/dtos/category_param.dto'
import { GetAllAccountsResponseDto } from '../../modules/account/dtos/get_all_accounts_response.dto'
import {
    generateLambdaResponse,
    parseLambdaBearerToken,
    parseLambdaPathParameters,
    parseLambdaQueryParameters,
} from '../../utils/lambda.utils'
import { getJwtPayload } from '../../utils/jsonwebtoken.utils'
import { AppError } from '../../utils/app_error.utils'
import { ErrorResponse } from '../../types/error_response'
import { PaginatedResult, PaginationParams } from '../../types/pagination'

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
    try {
        const token = parseLambdaBearerToken(event)
        const sessionPayload = getJwtPayload(token)
        const { categoryId } = parseLambdaPathParameters<CategoryParamDto>(event)
        const { page, limit } = parseLambdaQueryParameters<PaginationParams>(event)

        const accountsData = await accountService.getAllAccountsByCategory(
            sessionPayload.id,
            categoryId ? parseInt(categoryId) : undefined,
            page,
            limit
        )

        return generateLambdaResponse<PaginatedResult<GetAllAccountsResponseDto>>(200, accountsData)
    } catch (error) {
        if (error instanceof AppError) {
            return generateLambdaResponse<ErrorResponse>(error.statusCode, { error: error.message })
        }

        console.log(`There was an error: ${error}`)
        return generateLambdaResponse<ErrorResponse>(500, { error: 'Internal server error' })
    }
}
