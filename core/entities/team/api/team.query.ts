import type { TeamModel } from '../models'
import { client } from '@core/shared/api/interceptor'
import type { UserStatus } from '@/core/entities/user/model'

export interface TeamDetailResponse {
  id: number
  name: string
  username: string
  password?: string
  leaderEmail: string
  status: UserStatus
}

/**
 * Lấy danh sách đội chơi trực tiếp từ API Backend 
 */
export const getTeams = async (): Promise<TeamModel[]> => {
  return client.request<TeamModel[]>({
    path: '/Team',
    method: 'GET',
  })
}

export const getTeamDetail = async (teamId: number, signal?: AbortSignal): Promise<TeamDetailResponse> => {
  return client.request<TeamDetailResponse>({
    path: `/Team/${teamId}`,
    method: 'GET',
    signal,
  })
}
