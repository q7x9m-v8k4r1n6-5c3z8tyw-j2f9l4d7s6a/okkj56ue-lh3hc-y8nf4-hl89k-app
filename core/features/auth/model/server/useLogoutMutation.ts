import { useMutation } from '@tanstack/react-query'
import { logout } from '../../api/auth.api'

/** Owns backend logout request state. */
export const useLogoutMutation = () => useMutation({
  mutationFn: logout,
})
