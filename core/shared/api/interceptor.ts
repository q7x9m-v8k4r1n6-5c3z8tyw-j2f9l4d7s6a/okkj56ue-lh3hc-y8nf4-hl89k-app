import axios, { type AxiosError } from 'axios'
import type { ApiResponseModel } from '../types/api-types'

const apiClient = () => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  })

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      return Promise.reject({
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      })
    }
  )

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