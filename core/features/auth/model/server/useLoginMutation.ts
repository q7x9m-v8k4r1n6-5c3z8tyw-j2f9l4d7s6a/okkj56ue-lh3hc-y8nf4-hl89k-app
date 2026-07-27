import { useMutation } from '@tanstack/react-query'
import { setAuthToken } from '@/core/shared/api'
import {
  getCurrentAuthUser,
  googleLogin,
  login,
} from '../../api/auth.api'
import type { LoginRequest } from '../auth.contract'
import { sessionAuthenticated } from '../authSession.slice'
import { useAuthDispatch } from '../frontend/authSession.hooks'
import {
  saveGoogleProfile,
  type GoogleProfile,
} from '../frontend/googleProfile.storage'

type LoginInput =
  | { method: 'password'; request: LoginRequest }
  | { method: 'google'; credential: string; profile: GoogleProfile | null }

/** Owns authentication server state and commits a successful session. */
export const useLoginMutation = () => {
  const dispatch = useAuthDispatch()

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const tokenResponse = input.method === 'password'
        ? await login(input.request)
        : await googleLogin(input.credential)
      setAuthToken(tokenResponse.accessToken)

      try {
        const apiUser = await getCurrentAuthUser()
        const profile = input.method === 'google' ? input.profile : null
        const user = profile && profile.email === apiUser.email
          ? {
            ...apiUser,
            displayName: apiUser.displayName?.trim() || profile.displayName,
            avatarUrl: profile.avatarUrl,
          }
          : apiUser
        return {
          accessToken: tokenResponse.accessToken,
          profile,
          user,
        }
      } catch (error) {
        setAuthToken(null)
        throw error
      }
    },
    onSuccess: ({ accessToken, profile, user }) => {
      if (profile && profile.email === user.email) saveGoogleProfile(profile)
      dispatch(sessionAuthenticated({ accessToken, user }))
    },
  })
}
