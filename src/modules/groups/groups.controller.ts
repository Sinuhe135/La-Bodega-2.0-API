import { Request, Response } from 'express-serve-static-core'
import * as groupsService from './groups.service'
import { CreateGroupDto } from './dtos/create_group.dto'
import { CreateGroupResponseDto } from './dtos/create_group_reponse.dto'
import { AppError } from '../../utils/app_error.utils'
import { ErrorResponse } from '../../types/error_response'
import { AuthLocals } from '../../types/auth_locals'

export async function createGroup(
    req: Request<{}, {}, CreateGroupDto>,
    res: Response<CreateGroupResponseDto | ErrorResponse, AuthLocals>
) {
    try {
        const group = await groupsService.createGroup(
            req.body.name,
            res.locals.userId
        )
        res.status(201).send(group)
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
