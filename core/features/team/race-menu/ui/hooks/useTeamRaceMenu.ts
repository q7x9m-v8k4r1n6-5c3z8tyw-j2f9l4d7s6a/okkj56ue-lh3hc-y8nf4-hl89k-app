import { useLogout } from '@/core/features/auth'

/**
 * Owns team menu actions that are independent from the current route.
 */
export const useTeamRaceMenu = () => {
  const logout = useLogout()

  return {
    isLoggingOut: logout.isLoggingOut,
    logout: logout.logout,
  }
}
