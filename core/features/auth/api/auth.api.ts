import type { LoginPayload, LoginResponse } from '../types'

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  return {
    accessToken: 'mock-access-token',
    user: {
      id: 'mock-user-id',
      name: payload.username,
    },
  }
}
