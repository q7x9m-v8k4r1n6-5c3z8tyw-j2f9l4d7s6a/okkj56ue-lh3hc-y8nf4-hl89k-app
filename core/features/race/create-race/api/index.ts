import { client } from '@/core/shared/api/interceptor'
import type { ApiResponseModel } from '@/core/shared/types/api-types' 
import type { BackendCreateRaceRequest } from '../helpers/mapToBackendRequest'

export const createNewRace = async (backendPayload: BackendCreateRaceRequest): Promise<string> => {
  const response = await client.request<ApiResponseModel<string>, BackendCreateRaceRequest>({
    path: '/api/v1/Race',
    method: 'POST',
    body: backendPayload,
  })
  
  return response.data ?? ''
}

/**
 * Upload ảnh bìa lên Azure Blob (qua backend), trả về URL ảnh thật.
 * Dùng ngay khi người dùng chọn file ở Bước 1, để có coverUrl thật
 * trước khi submit tạo Race.
 */
export const uploadRaceCoverImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file) 

  const response = await client.request<ApiResponseModel<string | null>>({
    path: '/api/v1/Image/upload',
    method: 'POST',
    body: formData,
  } as Parameters<typeof client.request>[0] & { body: unknown }) 

  return response.data ?? ''
}