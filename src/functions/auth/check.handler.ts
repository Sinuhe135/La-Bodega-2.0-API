import { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { generateLambdaResponse, parseLambdaBearerToken } from '../../utils/lambda.utils'
import { getJwtPayload } from '../../utils/jsonwebtoken.utils'
import { AppError } from '../../utils/app_error.utils'
import { ErrorResponse } from '../../types/error_response'
import { CheckSessionResponseDto } from '../../modules/auth/dtos/check_session_response.dto'

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
    try {
        const token = parseLambdaBearerToken(event)
        const sessionPayload = getJwtPayload(token)

        return generateLambdaResponse<CheckSessionResponseDto>(200, { id: sessionPayload.id })
    } catch (error) {
        if (error instanceof AppError) {
            return generateLambdaResponse<ErrorResponse>(error.statusCode, { error: error.message })
        }

        console.log(`There was an error: ${error}`)
        return generateLambdaResponse<ErrorResponse>(500, { error: 'Internal server error' })
    }
}
