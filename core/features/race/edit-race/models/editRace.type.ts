import { z } from 'zod'
import type { RaceDetail } from '@/core/entities/race'
import type { editRaceRequestSchema } from './editRace.schema'

export type EditRaceBooth = {
  id: string
  name: string
  place: string
  managers: EditRaceOrganizer[]
  description: string
}

export type EditRaceTeam = {
  id: string
  name: string
  leaderEmail: string
}

export type EditRaceOrganizer = {
  id: string
  displayName: string
  email: string
}

export type EditRaceForm = {
  raceName: string
  timeStart: string
  timeEnd: string
  coverUrl: string
  coverFileName: string
  place: string
  status: string
  modifiedAt: string
  booths: EditRaceBooth[]
  teams: EditRaceTeam[]
  organizers: EditRaceOrganizer[]
  settings: {
    isToggledLeaderboard: boolean
    isHiddenPoint: boolean
  }
}

export type EditRaceDetailResponse = RaceDetail

export type EditRaceRequest = z.infer<typeof editRaceRequestSchema>
