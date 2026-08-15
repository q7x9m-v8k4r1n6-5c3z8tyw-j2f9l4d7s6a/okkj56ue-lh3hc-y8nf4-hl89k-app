export type StationStatus = 'active' | 'locked' | 'completed' | 'occupied' | 'pending' | 'free'

export interface StationPin {
  id: string
  name: string
  code: string
  x: number // Relative percentage X [0, 100]
  y: number // Relative percentage Y [0, 100]
  status: StationStatus
  points: number
  description: string
  currentTeamName?: string | null
  currentOrganizerName?: string | null
}

export interface TeamMapData {
  raceId: string
  raceName: string
  mapImageUrl: string | null
  status: string
  stations: StationPin[]
  isEmpty: boolean
}
