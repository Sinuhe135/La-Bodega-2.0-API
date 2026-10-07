import { APIGatewayProxyHandlerV2 } from 'aws-lambda'

import * as accountService from '../../modules/account/account.service'
import { CreateAccountDto } from '../../modules/account/dtos/create_account.dto'
import { CreateAccountResponseDto } from '../../modules/account/dtos/create_account_response.dto'
import { generateLambdaResponse, parseLambdaBearerToken, parseLambdaBody } from '../../utils/lambda.utils'
import { getJwtPayload } from '../../utils/jsonwebtoken.utils'
import { AppError } from '../../utils/app_error.utils'
import { ErrorResponse } from '../../types/error_response'

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
    try {
        const token = parseLambdaBearerToken(event)
        const sessionPayload = getJwtPayload(token)
        const { name, username, email, password, platform, categoryId } = parseLambdaBody<CreateAccountDto>(event)

        const accountId = await accountService.createAccount(
            name,
            username,
            email,
            password,
            platform,
            categoryId,
            sessionPayload.id
        )

        return generateLambdaResponse<CreateAccountResponseDto>(201, { id: accountId })
    } catch (error) {
        if (error instanceof AppError) {
            return generateLambdaResponse<ErrorResponse>(error.statusCode, { error: error.message })
        }

        console.log(`There was an error: ${error}`)
        return generateLambdaResponse<ErrorResponse>(500, { error: 'Internal server error' })
    }
}
