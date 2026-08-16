import { client } from '@/core/shared/api'
import {
  raceMessageNotificationSchema,
  type RaceMessageNotification,
} from '../model/raceMessageNotification.schema'

export const getRaceMessageNotifications = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<RaceMessageNotification[]> => {
  const response = await client.request<unknown[]>({
    path: `/Race/${raceId}/messages`,
    query: { limit: 50 },
    signal,
  })

  return response.flatMap((message) => {
    const parsed = raceMessageNotificationSchema.safeParse(message)
    return parsed.success ? [parsed.data] : []
  })
}
