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

export type EditRaceDetailResponse = {
  id: string
  name?: string
  raceName?: string
  timeStart?: string
  timeEnd?: string
  place?: string
  status?: string
  coverUrl?: string | null
  modifiedAt?: string
  modifiedAtUtc?: string
  updatedAt?: string
  isToggledLeaderboard?: boolean
  isHiddenPoint?: boolean
  organizerId?: string[]
  raceTeam?: Array<{ teamID?: string; teamId?: string; team?: EditRaceTeam; name?: string; leaderEmail?: string }>
  booth?: Array<{
    id?: string
    boothId?: string
    name?: string
    place?: string
    location?: string
    description?: string
    organizerID?: string
    organizerId?: string
    managerId?: string
    managerIds?: string[]
    managers?: EditRaceOrganizer[]
  }>
}

export type EditRaceRequest = {
  raceName: string
  timeStart: string
  timeEnd: string
  place: string
  coverUrl?: string
  status?: string
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
