import { APIGatewayProxyHandlerV2 } from 'aws-lambda'

import * as authService from '../../modules/auth/auth.service'
import { generateLambdaResponse, parseLambdaBearerToken } from '../../utils/lambda.utils'
import { getJwtPayload } from '../../utils/jsonwebtoken.utils'
import { AppError } from '../../utils/app_error.utils'
import { ErrorResponse } from '../../types/error_response'
import { CurrentUserResponseDto } from '../../modules/auth/dtos/current_user_response.dto'

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
    try {
        const token = parseLambdaBearerToken(event)
        const sessionPayload = getJwtPayload(token)
        const user = await authService.getAuth(sessionPayload.id)

        return generateLambdaResponse<CurrentUserResponseDto>(200, user)
    } catch (error) {
        if (error instanceof AppError) {
            return generateLambdaResponse<ErrorResponse>(error.statusCode, { error: error.message })
        }

        console.log(`There was an error: ${error}`)
        return generateLambdaResponse<ErrorResponse>(500, { error: 'Internal server error' })
    }
}
