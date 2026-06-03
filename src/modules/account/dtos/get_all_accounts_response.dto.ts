export interface GetAllAccountsResponseDto {
    id: number
    name: string
    username: string
    email: string
    password: string
    platform: string
    creationDate: Date
    lastModifiedDate: Date
    groupId: number
}
