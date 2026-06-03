import { RowDataPacket } from 'mysql2'

export interface UserRow extends RowDataPacket {
    id: number
    lastLogin: Date
    creationDate: Date
    deleted: 0 | 1
}
