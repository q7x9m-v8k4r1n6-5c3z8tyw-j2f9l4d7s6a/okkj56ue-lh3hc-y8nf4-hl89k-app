export type ApiResponse<TData> = {
  statusCode: number,
  message?: string
  detailError?: string
  data: TData
}

// Gom các module lại và export ra ngoài cho toàn app sử dụng
export * from './interceptor'
