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
 * Normalized station item rendered in the Station Palette Sidebar.
 */
export interface StationItem {
  id: string
  name: string
  stationType?: string
  isHidden?: boolean
  place?: string
  status?: string
  description?: string
  managerName?: string
}
