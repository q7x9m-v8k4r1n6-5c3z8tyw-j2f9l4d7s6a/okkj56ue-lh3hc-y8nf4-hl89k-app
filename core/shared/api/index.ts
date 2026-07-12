export type ApiResponse<TData> = {
  statusCode: number,
  message?: string
  detailError?: string
  data: TData
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? 'http://localhost:5093'

export class ApiError extends Error {
  statusCode: number
  detailError: string

  constructor(statusCode: number, message: string, detailError = '') {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.detailError = detailError
  }
}

export const apiRequest = async <TData>(path: string, init?: RequestInit) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  const payload = await response.json() as ApiResponse<TData>

  if (!response.ok || payload.statusCode >= 400) {
    throw new ApiError(payload.statusCode || response.status, payload.message || 'API request failed.', payload.detailError || '')
  }

  return payload.data
}
