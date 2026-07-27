import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { ApiEnvelope } from './api.types'

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean }
type RefreshQueueItem = {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

type ApiErrorPayload = {
  detailError?: string
  message?: string
}

export type UnauthorizedRecovery = {
  recoverAccessToken: () => Promise<string>
  shouldRecover?: (path: string) => boolean
  onRecoveryFailed?: () => void
}

let currentAccessToken: string | null = null
let isRefreshing = false
let refreshQueue: RefreshQueueItem[] = []
let unauthorizedRecovery: UnauthorizedRecovery | null = null

/** Updates the bearer token attached to subsequent API requests. */
export const setAuthToken = (token: string | null) => {
  currentAccessToken = token
}

/** Injects an optional feature-owned strategy for recovering unauthorized requests. */
export const configureUnauthorizedRecovery = (
  recovery: UnauthorizedRecovery | null,
) => {
  unauthorizedRecovery = recovery
}

const processRefreshQueue = (error: unknown, token?: string) => {
  refreshQueue.forEach((item) => {
    if (error) {
      item.reject(error)
    } else if (token) {
      item.resolve(token)
    }
  })

  refreshQueue = []
}

const apiClient = () => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
  })

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (currentAccessToken) {
      config.headers.Authorization = `Bearer ${currentAccessToken}`
    }

    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig | undefined
      const requestPath = originalRequest?.url ?? ''
      const recovery = unauthorizedRecovery
      const canRecover = recovery
        ? (recovery.shouldRecover?.(requestPath) ?? true)
        : false

      if (
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        !recovery ||
        !canRecover
      ) {
        const responseData = error.response?.data as ApiErrorPayload | undefined
        return Promise.reject({
          status: error.response?.status,
          message:
            responseData?.detailError ??
            responseData?.message ??
            error.message,
          data: error.response?.data,
        })
      }

      if (isRefreshing) {
        try {
          const token = await new Promise<string>((resolve, reject) => {
            refreshQueue.push({ resolve, reject })
          })

          originalRequest.headers.Authorization = `Bearer ${token}`
          return instance(originalRequest)
        } catch (refreshError) {
          return Promise.reject(refreshError)
        }
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newAccessToken = await recovery.recoverAccessToken()

        setAuthToken(newAccessToken)
        processRefreshQueue(null, newAccessToken)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return instance(originalRequest)
      } catch (refreshError) {
        processRefreshQueue(refreshError)
        setAuthToken(null)
        recovery.onRecoveryFailed?.()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    },
  )

  /** Sends an API request and unwraps the backend response envelope. */
  async function request<TData, TBody = unknown>(config: {
    path: string
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: TBody
    query?: Record<string, unknown>
    headers?: Record<string, string>
    signal?: AbortSignal
  }): Promise<TData> {
    const res = await instance.request<ApiEnvelope<TData>>({
      url: config.path,
      method: config.method ?? 'GET',
      data: config.body,
      params: config.query,
      headers: config.headers,
      signal: config.signal,
    })

    const api = res.data
    if (api.statusCode !== 200) {
      throw new Error(api.detailError || api.message)
    }
    if (api.data === undefined) {
      throw new Error('API response does not contain data')
    }
    return api.data
  }

  return { request }
}

export const client = apiClient()
