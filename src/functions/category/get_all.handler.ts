import { APIGatewayProxyHandlerV2 } from 'aws-lambda'

import * as categoryService from '../../modules/category/category.service'
import { GetAllCategoriesResponseDto } from '../../modules/category/dtos/get_all_categories_response.dto'
import { generateLambdaResponse, parseLambdaBearerToken } from '../../utils/lambda.utils'
import { getJwtPayload } from '../../utils/jsonwebtoken.utils'
import { AppError } from '../../utils/app_error.utils'
import { ErrorResponse } from '../../types/error_response'

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
    try {
        const token = parseLambdaBearerToken(event)
        const sessionPayload = getJwtPayload(token)
        const categories = await categoryService.getAllCategories(sessionPayload.id)

        return generateLambdaResponse<GetAllCategoriesResponseDto[]>(200, categories)
    } catch (error) {
        if (error instanceof AppError) {
            return generateLambdaResponse<ErrorResponse>(error.statusCode, { error: error.message })
        }

        console.log(`There was an error: ${error}`)
        return generateLambdaResponse<ErrorResponse>(500, { error: 'Internal server error' })
    }
}
