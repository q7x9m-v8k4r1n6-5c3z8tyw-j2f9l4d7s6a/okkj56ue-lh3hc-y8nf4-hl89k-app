import { client } from '@/core/shared/api'
import { secretMissionDetailSchema, type SecretMissionDetailDto } from '../model/detailSecretMission.contract'

export const getSecretMissionDetail = async (
  missionId: string,
  signal?: AbortSignal
): Promise<SecretMissionDetailDto> => {
  const response = await client.request<unknown>({
    path: `/plugin/secret-mission/${missionId}`, // Gọi xuống API GetDetail
    method: 'GET',
    signal,
  })

  return secretMissionDetailSchema.parse(response)
}