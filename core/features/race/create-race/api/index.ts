import { client } from '@/core/shared/api/interceptor'
import type { CreateRaceRequest } from '@/core/features/race/create-race/models'

export const createNewRace = async (race: CreateRaceRequest): Promise<string> => {
  return client.request<string, CreateRaceRequest>({
    path: '/races',
    method: 'POST',
    body: race,
  })
}
