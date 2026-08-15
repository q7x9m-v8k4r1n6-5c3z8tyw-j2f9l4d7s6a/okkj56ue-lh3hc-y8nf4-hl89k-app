import { useQuery } from '@tanstack/react-query'
import { getRaceMessageNotifications } from '../../api/raceMessageNotifications.api'
import { raceMessageNotificationQueryKeys } from './raceMessageNotification.queryKeys'

export const useRaceMessageNotificationsQuery = (
  raceId?: string,
  enabled = true,
) => useQuery({
  enabled: enabled && Boolean(raceId),
  queryKey: raceMessageNotificationQueryKeys.history(raceId),
  queryFn: ({ signal }) => getRaceMessageNotifications(raceId ?? '', signal),
})
