import { insertGroup } from './groups.repository'
import { CreateGroupResponseDto } from './dtos/create_group_reponse.dto'

export async function createGroup(
    name: string,
    userId: number
): Promise<CreateGroupResponseDto> {
    const id = await insertGroup(name, userId)
    return { id }
}
