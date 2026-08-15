import { client } from '@/core/shared/api'
import {
  organizerAnnouncementMessageSchema,
  type OrganizerAnnouncementMessage,
} from '../model/organizerAnnouncementHistory.contract'

export const getOrganizerAnnouncementHistory = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<OrganizerAnnouncementMessage[]> => {
  const response = await client.request<unknown[]>({
    path: `/Race/${raceId}/messages`,
    query: { limit: 50 },
    signal,
  })

  return response.flatMap((message) => {
    const parsed = organizerAnnouncementMessageSchema.safeParse(message)
    return parsed.success ? [parsed.data] : []
  })
}
