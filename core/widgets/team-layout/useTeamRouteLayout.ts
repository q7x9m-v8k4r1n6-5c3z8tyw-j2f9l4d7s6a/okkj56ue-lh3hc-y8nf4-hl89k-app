import { useAuthSession } from '@/core/features/auth'

/**
 * Adapts authenticated team data for the team route shell.
 */
export const useTeamRouteLayout = () => {
  const { user } = useAuthSession()

  return {
    teamName: user?.displayName?.trim()
      || user?.email?.split('@')[0]
      || 'TEAM MUHAHA',
  }
}
