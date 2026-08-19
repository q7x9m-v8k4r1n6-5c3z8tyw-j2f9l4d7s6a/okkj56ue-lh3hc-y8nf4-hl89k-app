import { useTeamBoothNotifications } from './hooks/useTeamBoothNotifications'

/** Mounts the race-scoped notification workflow without rendering UI. */
export const TeamBoothNotificationListener = () => {
  useTeamBoothNotifications()
  return null
}
