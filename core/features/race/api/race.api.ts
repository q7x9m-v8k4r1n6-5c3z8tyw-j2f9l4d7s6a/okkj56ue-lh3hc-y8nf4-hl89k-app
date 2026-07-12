import { apiRequest } from '@/core/shared'
import type { AdminRaceDetail, AdminRaceListResponse, RaceFormPayload } from '@/core/features/race/types'

const RACE_API_PATH = '/api/v1/race'

export const getAdminRaceList = () =>
  apiRequest<AdminRaceListResponse>(RACE_API_PATH)

export const getAdminRaceDetail = (raceId: string | number) =>
  apiRequest<AdminRaceDetail>(`${RACE_API_PATH}/${raceId}`)

export const createRace = (payload: RaceFormPayload) =>
  apiRequest<AdminRaceDetail>(RACE_API_PATH, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const updateRace = (raceId: string | number, payload: RaceFormPayload) =>
  apiRequest<AdminRaceDetail>(`${RACE_API_PATH}/${raceId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
