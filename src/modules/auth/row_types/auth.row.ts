import { RowDataPacket } from 'mysql2'

export interface AuthRow extends RowDataPacket {
    id: number
    username: string
    keyHash: string
}
