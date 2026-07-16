export type ApiResponseModel<T> = {
    statusCode: number
    message: string
    detailError: string
    data: T | null
}
export interface PagedResult<T> {
  items: T[]
  pageNumber: number
  pageSize: number
  totalItems: number
  totalPages: number
}