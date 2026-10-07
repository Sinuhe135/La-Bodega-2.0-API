import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { AppError } from './app_error.utils'

export function parseLambdaBody<T>(event: APIGatewayProxyEventV2): T {
    if (!event.body) throw new AppError(400, 'Request body is required')
    try {
        return JSON.parse(event.body) as T
    } catch {
        throw new AppError(400, 'Invalid JSON body')
    }
}

export function parseLambdaBearerToken(event: APIGatewayProxyEventV2): string {
    const token = event.headers && event.headers.authorization ? event.headers.authorization.replace('Bearer ', '') : ''
    return token
}

export function parseLambdaPathParameters<T>(event: APIGatewayProxyEventV2): T {
    const params = event.pathParameters
    if (!params) throw new AppError(400, 'Path parameters are required')
    return params as T
}

export function parseLambdaQueryParameters<T>(event: APIGatewayProxyEventV2): T {
    const query = event.queryStringParameters
    return query ? (query as T) : ({} as T)
}

export function generateLambdaResponse<dto>(status: number, body: dto): APIGatewayProxyResultV2 {
    return {
        statusCode: status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }
}
