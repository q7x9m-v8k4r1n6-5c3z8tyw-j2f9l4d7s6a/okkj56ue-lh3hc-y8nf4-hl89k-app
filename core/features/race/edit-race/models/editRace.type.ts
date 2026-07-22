export type EditRaceBooth = {
  id: string
  name: string
  place: string
  managerId: string
  managerName: string
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
  booths: EditRaceBooth[]
  teams: EditRaceTeam[]
  organizers: EditRaceOrganizer[]
  settings: {
    isToggledLeaderboard: boolean
    isHiddenPoint: boolean
  }
}

export type EditRaceDetailResponse = {
  id: string
  name?: string
  raceName?: string
  timeStart?: string
  timeEnd?: string
  place?: string
  coverUrl?: string | null
  isToggledLeaderboard?: boolean
  isHiddenPoint?: boolean
  organizerId?: string[]
  raceTeam?: Array<{ teamID?: string; teamId?: string }>
  booth?: Array<{
    name?: string
    place?: string
    description?: string
    organizerID?: string
    organizerId?: string
  }>
}

export type EditRaceRequest = {
  raceName: string
  timeStart: string
  timeEnd: string
  place: string
  coverUrl?: string
  isToggledLeaderboard: boolean
  isHiddenPoint: boolean
  organizerId: string[]
  raceTeam: Array<{ teamID: string }>
  booth: Array<{
    name: string
    place: string
    description: string
    organizerID: string
  }>
}
