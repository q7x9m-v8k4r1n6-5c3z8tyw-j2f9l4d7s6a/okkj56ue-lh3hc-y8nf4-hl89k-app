import { client } from '@/core/shared/api'
import { z } from 'zod'
import { 
  secretMissionOverviewItemSchema, 
  type SecretMissionOverviewDto 
} from '../model/listSecretMission.contract'

export const getSecretMissionOverview = async (
  raceId: string,
  signal?: AbortSignal
): Promise<SecretMissionOverviewDto[]> => {
  const response = await client.request<unknown>({
    path: `/plugin/secret-mission/races/${raceId}/overview`,
    method: 'GET',
    signal,
  })

  return z.array(secretMissionOverviewItemSchema).parse(response)
}