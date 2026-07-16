export type RaceLifecycleStatus = 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'

export type RaceTeamDetail = {
  id?: string
  teamId?: string
  teamID?: string
  name?: string
  email?: string
  leaderEmail?: string
}

export type RaceOrganizerDetail = {
  id?: string
  organizerId?: string
  name?: string
  displayName?: string
  email?: string
}

export type RaceBoothDetail = {
  id?: string
  boothId?: string
  name?: string
  place?: string
  location?: string
  description?: string
  organizerID?: string
  organizerId?: string
  managerIds?: string[]
  managers?: RaceOrganizerDetail[]
}

/**
 * Model thuoc layer entities: mo ta du lieu Race tra ve tu API.
 * Kieu nay chap nhan ca ten field cu va moi de form edit doc duoc du lieu hien co.
 */
export type RaceDetailModel = {
  id: string
  name?: string
  raceName?: string
  place?: string
  location?: string
  timeStart?: string
  startAt?: string
  timeEnd?: string
  endAt?: string
  coverUrl?: string
  imageName?: string
  status?: RaceLifecycleStatus
  isToggledLeaderboard?: boolean
  isHiddenPoint?: boolean
  organizerId?: string[]
  organizers?: RaceOrganizerDetail[]
  raceTeam?: RaceTeamDetail[]
  teams?: RaceTeamDetail[]
  booth?: RaceBoothDetail[]
  booths?: RaceBoothDetail[]
  stations?: RaceBoothDetail[]
}
