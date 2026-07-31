import { useEffect } from 'react'
import {
  configureUnauthorizedRecovery,
  setAuthToken,
} from '@/core/shared/api'
import { refreshAccessToken } from '../../api/auth.api'
import { sessionCleared } from '../authSession.slice'
import { useAuthDispatch } from '../frontend/authSession.hooks'
import { clearGoogleProfile } from '../frontend/googleProfile.storage'

const AUTH_ENTRY_PATHS = [
  '/auth/login',
  '/auth/google-login',
  '/auth/refresh-token',
]

/** Connects the generic HTTP 401 recovery mechanism to the auth feature lifecycle. */
export const useAuthClientRecovery = () => {
  const dispatch = useAuthDispatch()

  useEffect(() => {
    configureUnauthorizedRecovery({
      recoverAccessToken: async () => {
        const response = await refreshAccessToken()
        return response.accessToken
      },
      shouldRecover: (path) => {
        const normalizedPath = path.toLowerCase()
        return !AUTH_ENTRY_PATHS.some((entryPath) => (
          normalizedPath.includes(entryPath)
        ))
      },
      onRecoveryFailed: () => {
        setAuthToken(null)
        clearGoogleProfile()
        dispatch(sessionCleared())

        if (!window.location.pathname.startsWith('/login')) {
          window.location.assign('/login')
        }
      },
    })

    return () => configureUnauthorizedRecovery(null)
  }, [dispatch])
}
