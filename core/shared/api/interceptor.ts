import axios from 'axios'
import type { ApiResponseModel } from '../types/api-types'
import { setupAuthInterceptors } from './auth-interceptor'

const apiClient = () => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
  })

  // Cắm module Auth vào Axios
  setupAuthInterceptors(instance)

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