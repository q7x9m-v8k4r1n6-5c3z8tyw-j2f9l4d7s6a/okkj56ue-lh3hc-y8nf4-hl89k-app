export type ApiResponseModel<T> = {
    statusCode: number
    message: string
    detailError: string
    data: T | null
}