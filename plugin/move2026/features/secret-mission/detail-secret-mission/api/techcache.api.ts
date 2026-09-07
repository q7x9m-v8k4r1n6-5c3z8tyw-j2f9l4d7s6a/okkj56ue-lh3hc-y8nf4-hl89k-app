import { client } from '@/core/shared/api'
import {
  verifyMissionCodeResponseSchema,
  submitTechCacheResultResponseSchema,
  type SubmitTechCacheResultResponse,
  type TechCacheResultType,
} from '../model/techcache.contract'

export const verifyMissionCode = async (missionId: string, code: string): Promise<boolean> => {
  const response = await client.request<unknown>({
    path: `/plugin/secret-mission/${missionId}/verify-code`,
    method: 'POST',
    body: { code },
  })
  return verifyMissionCodeResponseSchema.parse(response)
}

export const submitTechCacheResult = async (
  missionId: string,
  code: string,
  result: TechCacheResultType,
  video: File,
): Promise<SubmitTechCacheResultResponse> => {
  const formData = new FormData()
  formData.append('Code', code)
  formData.append('Result', result)
  formData.append('Video', video)

  const response = await client.request<unknown>({
    path: `/plugin/secret-mission/${missionId}/submit-result`,
    method: 'POST',
    body: formData,
  })
  return submitTechCacheResultResponseSchema.parse(response)
}