export type ApiEnvelope<TData> = {
  statusCode: number
  message?: string
  detailError?: string
  data?: TData
}
