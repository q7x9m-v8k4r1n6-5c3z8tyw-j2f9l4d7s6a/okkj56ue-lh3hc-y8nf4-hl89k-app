import { useAuthSession } from '@/core/features/auth'

/**
 * Adapts authenticated organizer data for the organizer route shell.
 */
export const useOrganizerRouteLayout = () => {
  const { user } = useAuthSession()

  return {
    stationName: user?.displayName?.trim()
      || user?.email?.split('@')[0]
      || 'QUẢN TRẠM A',
  }
}
