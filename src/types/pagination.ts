export interface PaginationParams {
    page?: string
    limit?: string
}

export interface PaginatedResult<T> {
    data: T[]
    page: number
    limit: number
    totalPages: number
}
