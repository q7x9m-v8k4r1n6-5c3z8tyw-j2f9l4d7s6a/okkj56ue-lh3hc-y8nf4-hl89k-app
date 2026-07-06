import { login } from '../api'
import type { LoginPayload } from '../types'

export const useLogin = () => {
  return {
    login: (payload: LoginPayload) => login(payload),
  }
}
