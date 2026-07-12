import type { MoveNameMissionRow, MoveRaceStation } from '@/core/shared/lib'

export type RaceStatus = 'upcoming' | 'live' | 'done'

export type AdminRaceListItem = {
  id: number
  name: string
  location: string
  startAt: string
  endAt: string
  durationMinutes: number
  status: RaceStatus
  participantCount: number
  completedCheckpoints: number
  pendingCheckpoints: number
  lastUpdatedAt: string
}

export type AdminRaceListResponse = {
  generatedAt: string
  totalCount: number
  summary: {
    upcomingCount: number
    inProgressCount: number
    completedCount: number
  }
  items: AdminRaceListItem[]
}

export type RaceStatistics = {
  generatedAt: string
  totalStations: number
  activeStations: number
  completedCheckpoints: number
  pendingCheckpoints: number
  totalTeams: number
  teamsCompleted: number
  teamsInProgress: number
  teamsWaiting: number
  completionRate: number
}

export type AdminRaceDetail = {
  id: number
  name: string
  location: string
  startAt: string
  endAt: string
  durationMinutes: number
  status: RaceStatus
  participantCount: number
  imageName: string
  lastUpdatedAt: string
  statistics: RaceStatistics
  stations: Array<MoveRaceStation & { status: string }>
  teams: MoveNameMissionRow[]
  organizers: MoveNameMissionRow[]
  settingsRows: MoveNameMissionRow[]
}

export type RaceFormPayload = {
  name: string
  location: string
  startAt: string
  endAt: string
  imageName: string
  stations: MoveRaceStation[]
  teams: MoveNameMissionRow[]
  organizers: MoveNameMissionRow[]
  settingsRows: MoveNameMissionRow[]
}
