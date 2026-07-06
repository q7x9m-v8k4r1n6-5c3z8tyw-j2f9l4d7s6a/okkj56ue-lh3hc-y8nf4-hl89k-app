export type AuthUser = {
  id: string
  name: string
}

export type LoginPayload = {
  username: string
  password: string
}

export type LoginResponse = {
  accessToken: string
  user: AuthUser
}
