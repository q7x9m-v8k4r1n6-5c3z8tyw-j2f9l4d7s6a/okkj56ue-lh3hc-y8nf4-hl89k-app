import type { OrganizerSummary } from '@/core/entities/organizer'
import type { TeamSummary } from '@/core/entities/team'

export type CreateRaceBasicForm = {
  name: string
  startAt: string
  endAt: string
  imageName: string
  location: string
  rules: string
}

export type CreateRaceStationForm = {
  id: string
  name: string
  location: string
  managers: OrganizerSummary[]
  description: string
}

export type CreateRaceSettingsForm = {
  showLeaderboard: boolean
  showScores: boolean
}

export type CreateRaceFormState = {
  step: number
  basic: CreateRaceBasicForm
  stations: CreateRaceStationForm[]
  teams: TeamSummary[]
  organizers: OrganizerSummary[]
  settings: CreateRaceSettingsForm
  errors: {
    basic: Partial<Record<keyof CreateRaceBasicForm, string>>
    stations: Record<string, Partial<Record<'name' | 'location' | 'managers', string>>>
    team: string
    organizer: string
  }
}

/** Creates a new form value so different provider instances never share state. */
export const createInitialRaceForm = (): CreateRaceFormState => ({
  step: 1,
  basic: { name: '', startAt: '', endAt: '', imageName: '', location: '', rules: '' },
  stations: [],
  teams: [],
  organizers: [],
  settings: { showLeaderboard: true, showScores: true },
  errors: { basic: {}, stations: {}, team: '', organizer: '' },
})
