import { client } from '@/core/shared/api'
import { z } from 'zod'
import {
  userProfileSchema,
  type UserProfile,
} from '@/core/entities/user'
import {
  googleLoginRequestSchema,
  loginRequestSchema,
  loginResponseSchema,
  logoutResponseSchema,
  type LoginRequest,
  type LoginResponse,
} from '../model/auth.contract'

/** Shape returned by GET /auth/me before it is normalized for the UI model. */
const authMeResponseSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  userType: z.string().min(1).transform((value) => value.toLowerCase()),
  roles: z.array(z.object({
    code: z.string().min(1),
  })).default([]),
  displayName: z.string().nullable(),
  avatarUrl: z.string().url().or(z.literal('')).nullable().optional(),
}).transform(({ roles, ...user }) => ({
  ...user,
  role: roles[0]?.code ?? '',
  roles: roles.map((role) => role.code),
}))

/** Authenticates a username/password credential pair. */
export const login = async (
  request: LoginRequest,
): Promise<LoginResponse> => {
  const body = loginRequestSchema.parse(request)
  const response = await client.request<unknown, LoginRequest>({
    path: '/Auth/login',
    method: 'POST',
    body,
  })
  return loginResponseSchema.parse(response)
}

/** Exchanges a Google ID token for an application access token. */
export const googleLogin = async (
  idToken: string,
): Promise<LoginResponse> => {
  const body = googleLoginRequestSchema.parse({ idToken })
  const response = await client.request<unknown, typeof body>({
    path: '/Auth/google-login',
    method: 'POST',
    body,
  })
  return loginResponseSchema.parse(response)
}

/** Fetches the authenticated session user. */
export const getCurrentAuthUser = async (): Promise<UserProfile> => {
  const response = await client.request<unknown>({
    path: '/Auth/me',
  })
  return userProfileSchema.parse(authMeResponseSchema.parse(response))
}

/** Revokes the refresh-token session on the backend. */
export const logout = async (): Promise<boolean> => {
  const response = await client.request<unknown>({
    path: '/Auth/logout',
    method: 'POST',
  })
  return logoutResponseSchema.parse(response)
}

/** Exchanges the refresh-token cookie for a new access token. */
export const refreshAccessToken = async (): Promise<LoginResponse> => {
  const response = await client.request<unknown>({
    path: '/Auth/refresh-token',
    method: 'POST',
  })
  return loginResponseSchema.parse(response)
}
