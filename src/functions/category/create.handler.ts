import { APIGatewayProxyHandlerV2 } from 'aws-lambda'

import * as categoryService from '../../modules/category/category.service'
import { CreateCategoryDto } from '../../modules/category/dtos/create_category.dto'
import { CreateCategoryResponseDto } from '../../modules/category/dtos/create_category_reponse.dto'
import { generateLambdaResponse, parseLambdaBearerToken, parseLambdaBody } from '../../utils/lambda.utils'
import { getJwtPayload } from '../../utils/jsonwebtoken.utils'
import { AppError } from '../../utils/app_error.utils'
import { ErrorResponse } from '../../types/error_response'

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
    try {
        const token = parseLambdaBearerToken(event)
        const sessionPayload = getJwtPayload(token)
        const body = parseLambdaBody<CreateCategoryDto>(event)
        const category = await categoryService.createCategory(body.name, sessionPayload.id)

        return generateLambdaResponse<CreateCategoryResponseDto>(201, category)
    } catch (error) {
        if (error instanceof AppError) {
            return generateLambdaResponse<ErrorResponse>(error.statusCode, { error: error.message })
        }

        console.log(`There was an error: ${error}`)
        return generateLambdaResponse<ErrorResponse>(500, { error: 'Internal server error' })
    }
}
