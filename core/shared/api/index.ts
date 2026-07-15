export type ApiResponse<TData> = {
  statusCode: number,
  message?: string
  detailError?: string
  data: TData
}

export * from './interceptor'
