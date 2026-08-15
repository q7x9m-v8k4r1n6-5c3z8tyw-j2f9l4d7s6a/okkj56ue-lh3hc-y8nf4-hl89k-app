import { client } from '@/core/shared/api'
import {
  teamAnnouncementMessageSchema,
  type TeamAnnouncementMessage,
} from '../model/teamAnnouncementHistory.contract'

export const getTeamAnnouncementHistory = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<TeamAnnouncementMessage[]> => {
  const response = await client.request<unknown[]>({
    path: `/Race/${raceId}/messages`,
    query: { limit: 50 },
    signal,
  })

  return response.flatMap((message) => {
    const parsed = teamAnnouncementMessageSchema.safeParse(message)
    return parsed.success ? [parsed.data] : []
  })
}
