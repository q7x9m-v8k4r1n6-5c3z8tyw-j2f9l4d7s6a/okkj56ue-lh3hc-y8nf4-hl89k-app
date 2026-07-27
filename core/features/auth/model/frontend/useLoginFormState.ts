import { useState, type FormEvent } from 'react'

export type LoginCredentials = {
  username: string
  password: string
}

/** Owns login input state and performs synchronous required-field validation. */
export const useLoginFormState = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  })
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    password: '',
  })
  const [globalError, setGlobalError] = useState('')

  const updateField = (field: keyof LoginCredentials, value: string) => {
    setCredentials((current) => ({ ...current, [field]: value }))
    setGlobalError('')
    if (fieldErrors[field]) {
      setFieldErrors((current) => ({ ...current, [field]: '' }))
    }
  }

  const validateCredentials = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errors = {
      username: credentials.username.trim()
        ? ''
        : 'Vui lòng điền tên đăng nhập',
      password: credentials.password.trim()
        ? ''
        : 'Vui lòng điền mật khẩu',
    }
    setFieldErrors(errors)
    if (errors.username || errors.password) return null
    return credentials
  }

  return {
    credentials,
    fieldErrors,
    globalError,
    setGlobalError,
    updateField,
    validateCredentials,
  }
}
