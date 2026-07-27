import { useEffect } from 'react'
import { setAuthToken } from '@/core/shared/api'
import {
  getCurrentAuthUser,
  refreshAccessToken,
} from '../../api/auth.api'
import {
  sessionAuthenticated,
  sessionCleared,
  sessionInitialized,
} from '../authSession.slice'
import {
  useAuthDispatch,
  useAuthSession,
} from '../frontend/authSession.hooks'
import { restoreGoogleProfile } from '../frontend/googleProfile.storage'

let restorePromise: ReturnType<typeof restoreSession> | null = null

const restoreSession = async () => {
  const token = await refreshAccessToken()
  setAuthToken(token.accessToken)
  const user = restoreGoogleProfile(await getCurrentAuthUser())
  return { accessToken: token.accessToken, user }
}

/** Restores the app-wide auth session once when the application starts. */
export const useRestoreAuthSession = () => {
  const dispatch = useAuthDispatch()
  const { isInitialized } = useAuthSession()

  useEffect(() => {
    if (
      window.location.pathname === '/login'
      || window.location.pathname === '/login/'
    ) {
      dispatch(sessionInitialized())
      return
    }

    if (!restorePromise) {
      restorePromise = restoreSession().finally(() => {
        restorePromise = null
      })
    }

    void restorePromise
      .then((session) => dispatch(sessionAuthenticated(session)))
      .catch(() => {
        setAuthToken(null)
        dispatch(sessionCleared())
      })
      .finally(() => dispatch(sessionInitialized()))
  }, [dispatch])

  return { isInitialized }
}
