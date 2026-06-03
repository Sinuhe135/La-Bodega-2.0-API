import { RowDataPacket } from 'mysql2'

export interface AccountRow extends RowDataPacket {
    id: number
    name: string
    username: string
    email: string
    password: string
    platform: string
    creationDate: Date
    lastModifiedDate: Date
    groupId: number
    deleted: number
}
