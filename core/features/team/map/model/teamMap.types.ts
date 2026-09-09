export type StationStatus = 'free' | 'occupied'

export interface StationPin {
  id: string
  name: string
  place: string
  description: string
  x: number // Toạ độ % ngang (0-100)
  y: number // Toạ độ % dọc (0-100)
  status: StationStatus
}

export interface MapData {
  backgroundImageUrl: string
  stations: StationPin[]
  isHideBoothDescription?: boolean
  isDisabledBoothStatus?: boolean
}
