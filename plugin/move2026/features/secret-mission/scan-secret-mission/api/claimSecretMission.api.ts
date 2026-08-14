import { client } from '@/core/shared/api'
import {
  claimSecretMissionResponseSchema,
  type ClaimSecretMissionResponse,
} from '../model/claimSecretMission.contract'

export const claimSecretMission = async (
  missionId: string,
): Promise<ClaimSecretMissionResponse> => {
  const response = await client.request<unknown>({
    path: `/plugin/secret-mission/${missionId}/claim`,
    method: 'POST',
  })

  return claimSecretMissionResponseSchema.parse(response)
}