import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { ApiResponseModel } from '../types/api-types'

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean }
type RefreshQueueItem = {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

let currentAccessToken: string | null = null
let isRefreshing = false
let refreshQueue: RefreshQueueItem[] = []

export const setAuthToken = (token: string | null) => {
  currentAccessToken = token
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
      const isAuthEndpoint =
        originalRequest?.url?.includes('/auth/login') ||
        originalRequest?.url?.includes('/auth/refresh-token') ||
        originalRequest?.url?.includes('/auth/google-login')

      if (
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        isAuthEndpoint
      ) {
        return Promise.reject({
          status: error.response?.status,
          message: error.message,
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
        const refreshResponse = await axios.post<ApiResponseModel<{ accessToken: string }>>(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true },
        )
        const newAccessToken = refreshResponse.data.data?.accessToken

        if (!newAccessToken) {
          throw new Error('Refresh response does not contain an access token')
        }

        setAuthToken(newAccessToken)
        processRefreshQueue(null, newAccessToken)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return instance(originalRequest)
      } catch (refreshError) {
        processRefreshQueue(refreshError)
        setAuthToken(null)
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    },
  )

  // Wrapper chuẩn hóa đầu ra
  async function request<TData, TBody = unknown>(config: {
    path: string
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    body?: TBody
    query?: Record<string, unknown>
    headers?: Record<string, string>
    signal?: AbortSignal
  }): Promise<TData> {
    const res = await instance.request<ApiResponseModel<TData>>({
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
    return api.data as TData
  }

  return { request }
}

export const client = apiClient()
