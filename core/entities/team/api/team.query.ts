import type { TeamModel } from '../models'
import { client } from '@core/shared/api/interceptor'

/**
 * Lấy danh sách đội chơi trực tiếp từ API Backend 
 */
export const getTeams = async (): Promise<TeamModel[]> => {
  return client.request<TeamModel[]>({
    path: '/Team',
    method: 'GET',
  })
}
