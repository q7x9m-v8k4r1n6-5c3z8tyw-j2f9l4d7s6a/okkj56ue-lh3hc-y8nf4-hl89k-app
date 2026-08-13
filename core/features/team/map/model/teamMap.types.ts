export type StationStatus = 'active' | 'locked' | 'completed'

export interface StationPin {
  id: string
  name: string
  code: string
  x: number // Toạ độ % ngang (0-100)
  y: number // Toạ độ % dọc (0-100)
  status: StationStatus
  points: number
  description: string
}

export interface MapData {
  backgroundImageUrl: string
  width: number
  height: number
  stations: StationPin[]
}
