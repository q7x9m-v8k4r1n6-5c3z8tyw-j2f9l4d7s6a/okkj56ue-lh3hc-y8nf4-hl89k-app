import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { authApi } from '../api'
import { setCredentials } from '../stores/authSlice'
import { setAuthToken } from '@/core/shared/api'
import { GOOGLE_CLIENT_ID } from '../constants'
import { getErrorMessage } from '../utils'

let googleIdentityInitialized = false

export const useLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({ username: '', password: '' })
  const [globalError, setGlobalError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const processLoginSuccess = async (loginData: { accessToken: string }) => {
    try {
      setAuthToken(loginData.accessToken)
      const user = await authApi.getMe()
      
      dispatch(setCredentials({ user, accessToken: loginData.accessToken }))
      navigate('/', { replace: true })
    } catch (err) {
      setAuthToken(null)
      setGlobalError(getErrorMessage(err, 'Không thể lấy thông tin người dùng.'))
      setIsLoading(false)
    }
  }

  const handleStandardLogin = async (e: FormEvent) => {
    e.preventDefault()
    
    let hasError = false
    const newFieldErrors = { username: '', password: '' }

    if (!username.trim()) {
      newFieldErrors.username = 'Vui lòng điền tên đăng nhập'
      hasError = true
    }
    
    if (!password.trim()) {
      newFieldErrors.password = 'Vui lòng điền mật khẩu'
      hasError = true
    }

    if (hasError) {
      setFieldErrors(newFieldErrors)
      return
    }

    try {
      setIsLoading(true)
      setGlobalError('')
      const response = await authApi.login({ username, password })
      await processLoginSuccess(response)
    } catch (err) {
      setGlobalError(getErrorMessage(err))
      setIsLoading(false)
    }
  }

  // Hàm tiện ích giúp UI gọi để cập nhật state và xóa lỗi cùng lúc
  const handleFieldChange = (field: 'username' | 'password', value: string) => {
    if (field === 'username') {
      setUsername(value)
      if (fieldErrors.username) setFieldErrors(prev => ({ ...prev, username: '' }))
    } else {
      setPassword(value)
      if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }))
    }
    if (globalError) setGlobalError('')
  }

  useEffect(() => {
    let isDisposed = false
    let retryTimer: number | undefined

    const initializeGoogleButton = () => {
      if (isDisposed) return

      const google = (window as any).google
      const buttonContainer = document.getElementById('googleSignInBtn')

      if (!google?.accounts?.id || !buttonContainer) {
        retryTimer = window.setTimeout(initializeGoogleButton, 100)
        return
      }

      if (!GOOGLE_CLIENT_ID) {
        setGlobalError('Thiếu cấu hình Google Client ID.')
        return
      }

      if (!googleIdentityInitialized) {
        google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          try {
            setIsLoading(true)
            setGlobalError('')
            const apiRes = await authApi.googleLogin(response.credential)
            await processLoginSuccess(apiRes)
          } catch (err) {
            setGlobalError(getErrorMessage(err, 'Đăng nhập Google thất bại.'))
            setIsLoading(false)
          }
        }
      })
        googleIdentityInitialized = true
      }

      buttonContainer.replaceChildren()
      google.accounts.id.renderButton(
        buttonContainer,
        { theme: 'outline', size: 'large', width: '380' } 
      )
    }

    initializeGoogleButton()

    return () => {
      isDisposed = true
      if (retryTimer !== undefined) window.clearTimeout(retryTimer)
    }
  }, [])

  // Chỉ "phơi bày" ra những thứ UI cần dùng
  return {
    username,
    password,
    fieldErrors,
    globalError,
    isLoading,
    handleFieldChange,
    handleStandardLogin
  }
}
