import { APIGatewayProxyHandlerV2 } from 'aws-lambda'

import * as authService from '../../modules/auth/auth.service'
import { LoginDto } from '../../modules/auth/dtos/login.dto'
import { LoginResponseDto } from '../../modules/auth/dtos/login_response.dto'
import { AppError } from '../../utils/app_error.utils'
import { generateLambdaResponse, parseLambdaBody } from '../../utils/lambda.utils'
import { ErrorResponse } from '../../types/error_response'

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
    try {
        const body = parseLambdaBody<LoginDto>(event)
        const jwt = await authService.login(body.username, body.keyHash)

        return generateLambdaResponse<LoginResponseDto>(200, { jwt })
    } catch (error) {
        if (error instanceof AppError) {
            return generateLambdaResponse<ErrorResponse>(error.statusCode, { error: error.message })
        }

        console.log(`There was an error: ${error}`)
        return generateLambdaResponse<ErrorResponse>(500, { error: 'Internal server error' })
    }
}
