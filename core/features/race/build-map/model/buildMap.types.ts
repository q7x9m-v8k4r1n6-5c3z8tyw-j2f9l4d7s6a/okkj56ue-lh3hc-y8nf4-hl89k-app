/** Supported image MIME types for map uploading */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/pjpeg',
  'image/x-png',
] as const

/** Supported image file extensions for map uploading */
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'] as const

/** Maximum allowable image file size in bytes (20MB) */
export const MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number]

/**
 * State of the local map file, remote persisted URL, and dirty state.
 */
export interface MapFileState {
  file: File | null
  previewUrl: string | null
  persistedUrl: string | null
  isDirty: boolean
  error: string | null
}

/**
 * Normalized station item rendered in the Station Palette Sidebar and Admin Canvas.
 */
export interface StationItem {
  id: string
  name: string
  stationType?: string
  isHidden?: boolean
  place?: string
  status?: string
  description?: string | null
  managerName?: string | null
  currentTeamName?: string | null
  currentOrganizerName?: string | null
  mapX?: number | null // percentage [0..100], null if unplaced
  mapY?: number | null // percentage [0..100], null if unplaced
  isPlaced?: boolean
}

/**
 * Interactive Pin model rendered on the Map Canvas.
 */
export interface StationPin {
  id: string
  name: string
  code: string
  x: number // percentage [0..100]
  y: number // percentage [0..100]
  status: string
  isHidden: boolean
  currentTeamName: string | null
  currentOrganizerName: string | null
}

/**
 * Reducer state for an individual booth pin.
 */
export interface StationPinState {
  boothId: string
  boothName: string
  boothLocation: string
  description?: string | null
  status: 'free' | 'pending' | 'occupied' | string
  isHidden: boolean
  stationType?: string
  currentTeamName?: string | null
  currentOrganizerName?: string | null
  mapX: number | null // percentage [0..100] or null if unplaced
  mapY: number | null // percentage [0..100] or null if unplaced
}

/**
 * Pin Placement Reducer State.
 */
export interface PinPlacementState {
  booths: StationPinState[]
  initialBooths: StationPinState[]
  isLocked: boolean
  selectedBoothId: string | null
  activeDragBoothId: string | null
  isDirty: boolean
}
