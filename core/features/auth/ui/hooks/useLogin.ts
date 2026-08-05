import { useCallback } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuthErrorMessage } from '../../model/auth.error'
import { useLoginFormState } from '../../model/frontend/useLoginFormState'
import { getGoogleProfileFromCredential } from '../../model/frontend/googleProfile.storage'
import { useLoginMutation } from '../../model/server/useLoginMutation'
import { useGoogleLoginButton } from './useGoogleLoginButton'

/** Combines login form state, Google integration and auth server state for UI. */
export const useLogin = () => {
  const navigate = useNavigate()
  const { isPending, mutateAsync } = useLoginMutation()
  const form = useLoginFormState()
  const { setGlobalError } = form

  const finishLogin = useCallback((userType?: string) => {
    const normalizedUserType = userType?.toLowerCase()
    const nextPath = normalizedUserType === 'team'
      ? '/team'
      : normalizedUserType === 'organizer'
        ? '/organizer/select'
        : '/races'

    navigate(nextPath, { replace: true })
  }, [navigate])

  const handleStandardLogin = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    const request = form.validateCredentials(event)
    if (!request) return
    setGlobalError('')
    try {
      const session = await mutateAsync({ method: 'password', request })
      finishLogin(session.user.userType)
    } catch (error) {
      setGlobalError(getAuthErrorMessage(error))
    }
  }

  const handleGoogleCredential = useCallback(async (credential: string) => {
    setGlobalError('')
    try {
      const session = await mutateAsync({
        method: 'google',
        credential,
        profile: getGoogleProfileFromCredential(credential),
      })
      finishLogin(session.user.userType)
    } catch (error) {
      setGlobalError(
        getAuthErrorMessage(error, 'Đăng nhập Google thất bại.'),
      )
    }
  }, [finishLogin, mutateAsync, setGlobalError])

  const handleConfigurationError = useCallback(() => {
    setGlobalError('Thiếu cấu hình Google Client ID.')
  }, [setGlobalError])
  useGoogleLoginButton(handleGoogleCredential, handleConfigurationError)

  return {
    fieldErrors: form.fieldErrors,
    globalError: form.globalError,
    handlePasswordChange: (event: ChangeEvent<HTMLInputElement>) => {
      form.updateField('password', event.target.value)
    },
    handleStandardLogin,
    handleUsernameChange: (event: ChangeEvent<HTMLInputElement>) => {
      form.updateField('username', event.target.value)
    },
    isLoading: isPending,
    password: form.credentials.password,
    username: form.credentials.username,
  }
}
