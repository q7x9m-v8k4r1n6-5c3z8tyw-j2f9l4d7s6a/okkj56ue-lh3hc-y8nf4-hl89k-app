import { useNavigate } from 'react-router-dom'
import { setAuthToken } from '@/core/shared/api'
import { sessionCleared } from '../../model/authSession.slice'
import { useAuthDispatch } from '../../model/frontend/authSession.hooks'
import { clearGoogleProfile } from '../../model/frontend/googleProfile.storage'
import { useLogoutMutation } from '../../model/server/useLogoutMutation'

/** Logs out remotely and always clears the local application session. */
export const useLogout = () => {
  const navigate = useNavigate()
  const dispatch = useAuthDispatch()
  const logoutMutation = useLogoutMutation()

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync()
    } catch {
      // Local cleanup must still complete when remote revocation is unavailable.
    } finally {
      setAuthToken(null)
      clearGoogleProfile()
      dispatch(sessionCleared())
      navigate('/login', { replace: true })
    }
  }

  return { isLoggingOut: logoutMutation.isPending, logout }
}
