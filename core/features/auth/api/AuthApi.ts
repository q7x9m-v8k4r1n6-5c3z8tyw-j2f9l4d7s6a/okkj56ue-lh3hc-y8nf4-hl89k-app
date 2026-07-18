import { client } from '@/core/shared/api'
import type { UserInfo } from '../stores/index'

// Interface hứng dữ liệu từ Backend (khớp với AuthContract.cs)
export interface LoginResponse {
  accessToken: string
  accessTokenExpiration: string
  userId: string
}

export const authApi = {
  // 1. Đăng nhập truyền thống (Dành cho Team)
  login: async (body: Record<string, string>) => {
    return client.request<LoginResponse>({
      path: '/auth/login',
      method: 'POST',
      body,
    })
  },

  // 2. Đăng nhập Google (Dành cho Organizer)
  googleLogin: async (idToken: string) => {
    return client.request<LoginResponse>({
      path: '/auth/google-login',
      method: 'POST',
      body: { idToken },
    })
  },

  // 3. Lấy thông tin User hiện tại
  getMe: async () => {
    return client.request<UserInfo>({
      path: '/auth/me',
      method: 'GET',
    })
  },

  // 4. Đăng xuất (Backend sẽ tự đọc RefreshToken từ Cookie để thu hồi)
  logout: async () => {
    return client.request<boolean>({
      path: '/auth/logout',
      method: 'POST',
    })
  },

  refreshToken: async () => {
    return client.request<LoginResponse>({ 
      path: '/auth/refresh-token', 
      method: 'POST' 
      // Không cần body vì Backend sẽ tự lấy RefreshToken từ HttpOnly Cookie
    })
  },
}