import type { EditRaceStatus } from './editRace.contract'

export type EditRaceOrganizer = {
  id: string
  displayName: string
  email: string
  avatarUrl?: string | null
}

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

/**
 * Frontend-only model used by the editor.
 *
 * This model intentionally differs from the API DTO: it contains display
 * information and values formatted for HTML inputs.
 */
export type EditRaceForm = {
  raceName: string
  timeStart: string
  timeEnd: string
  coverUrl: string
  coverFileName: string
  place: string
  status: EditRaceStatus
  modifiedAt: string
  booths: EditRaceBooth[]
  teams: EditRaceTeam[]
  organizers: EditRaceOrganizer[]
  settings: {
    isToggledLeaderboard: boolean
    isHiddenPoint: boolean
  }
}

export type EditRaceFormErrors = {
  raceName?: string
  timeStart?: string
  timeEnd?: string
  place?: string
  coverFile?: string
  booths: Record<
    string,
    Partial<Record<'name' | 'place' | 'description', string>>
  >
}
