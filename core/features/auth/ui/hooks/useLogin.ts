import { useCallback, useState, useEffect } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuthErrorMessage, getAuthLockoutSeconds } from '../../model/auth.error'
import { useLoginFormState } from '../../model/frontend/useLoginFormState'
import { getGoogleProfileFromCredential } from '../../model/frontend/googleProfile.storage'
import { useLoginMutation } from '../../model/server/useLoginMutation'
import { useGoogleLoginButton } from './useGoogleLoginButton'

export const useLogin = () => {
  const navigate = useNavigate()
  const { isPending, mutateAsync } = useLoginMutation()
  const form = useLoginFormState()
  const { setGlobalError } = form

  const [lockoutSeconds, setLockoutSeconds] = useState(0)
  const [originalLockoutMessage, setOriginalLockoutMessage] = useState('')
  const [isDelaying, setIsDelaying] = useState(false) 

  useEffect(() => {
    if (lockoutSeconds <= 0) return
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [lockoutSeconds])

  const finishLogin = useCallback((userType?: string) => {
    const normalizedUserType = userType?.toLowerCase()
    const nextPath = normalizedUserType === 'team'
      ? '/team'
      : normalizedUserType === 'organizer'
        ? '/organizer/select'
        : '/'
    navigate(nextPath, { replace: true })
  }, [navigate])

  const handleError = useCallback((error: unknown, fallbackMsg?: string) => {
    const seconds = getAuthLockoutSeconds(error)
    if (seconds) {
      setLockoutSeconds(seconds)
      setOriginalLockoutMessage(getAuthErrorMessage(error, fallbackMsg))
      setGlobalError('') 
    } else {
      setGlobalError(getAuthErrorMessage(error, fallbackMsg))
    }
  }, [setGlobalError])

  const handleStandardLogin = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    const request = form.validateCredentials(event)
    if (!request) return
    setGlobalError('')
    setIsDelaying(true)
    const artificialDelay = new Promise((resolve) => setTimeout(resolve, 500))

    try {
      const session = await mutateAsync({ method: 'password', request })
      await artificialDelay 
      finishLogin(session.user.userType)
    } catch (error) {
      await artificialDelay 
      handleError(error)
    } finally {
      setIsDelaying(false)
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
      handleError(error, 'Đăng nhập Google thất bại.')
    }
  }, [finishLogin, mutateAsync, handleError])

  const handleConfigurationError = useCallback(() => {
    setGlobalError('Thiếu cấu hình Google Client ID.')
  }, [setGlobalError])

  useGoogleLoginButton(handleGoogleCredential, handleConfigurationError)

  const displayError = lockoutSeconds > 0 && originalLockoutMessage
    ? originalLockoutMessage.replace(/\d+(\s*giây)/i, `${lockoutSeconds}$1`)
    : form.globalError

  const isLoading = isPending || isDelaying 
  const isSubmitDisabled = isLoading || lockoutSeconds > 0

  return {
    fieldErrors: form.fieldErrors,
    globalError: displayError,
    handlePasswordChange: (event: ChangeEvent<HTMLInputElement>) => {
      form.updateField('password', event.target.value)
    },
    handleStandardLogin,
    handleUsernameChange: (event: ChangeEvent<HTMLInputElement>) => {
      form.updateField('username', event.target.value)
    },
    isLoading,
    isSubmitDisabled, 
    lockoutSeconds,
    password: form.credentials.password,
    username: form.credentials.username,
  }
}