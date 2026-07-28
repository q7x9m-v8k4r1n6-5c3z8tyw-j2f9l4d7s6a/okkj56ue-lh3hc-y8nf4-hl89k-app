import { useLogout } from '@/core/features/auth'

/**
 * Owns organizer menu actions that are independent from the current tab.
 */
export const useOrganizerMenu = () => {
  const logout = useLogout()

  return {
    isLoggingOut: logout.isLoggingOut,
    logout: logout.logout,
  }
}
