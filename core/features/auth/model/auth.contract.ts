import { z } from 'zod'

export const loginRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})
export const googleLoginRequestSchema = z.object({
  idToken: z.string().min(1),
})
export const loginResponseSchema = z.object({
  accessToken: z.string().min(1),
  accessTokenExpiration: z.string().min(1),
  userId: z.string().min(1),
})
export const logoutResponseSchema = z.boolean()

export type LoginRequest = z.infer<typeof loginRequestSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>
