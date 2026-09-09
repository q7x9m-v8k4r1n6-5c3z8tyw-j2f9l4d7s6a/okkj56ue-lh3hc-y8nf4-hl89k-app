/**
 * Validation rules and limits for race map files.
 * Aligns with backend ImageFileValidator (5MB limit and JPEG/PNG/WEBP whitelist).
 */

export const MAX_MAP_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export const ALLOWED_MAP_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

export type MapImageValidationResult = {
  valid: boolean
  error?: string
}

export interface PlacedBoothCoordinate {
  boothId: string
  mapX?: number | null
  mapY?: number | null
}

export interface StationPlacementValidationResult {
  isValid: boolean
  missingBoothIds: string[]
  missingCount: number
  totalCount: number
}

// Retain ValidationResult alias for backward compatibility and PROJECT.md contract compliance
export type ValidationResult = StationPlacementValidationResult

/**
 * Validates whether a file meets race map image upload criteria.
 */
export const isValidMapImageFile = (file?: File | null): MapImageValidationResult => {
  if (!file || file.size === 0) {
    return {
      valid: false,
      error: 'Vui lòng chọn tệp tin hình ảnh có dung lượng lớn hơn 0.',
    }
  }

  const isAllowedMime = ALLOWED_MAP_IMAGE_TYPES.has(file.type)
  const isAllowedExt = /\.(jpe?g|png|webp)$/i.test(file.name)

  if (!isAllowedMime && !isAllowedExt) {
    return {
      valid: false,
      error: 'Chỉ chấp nhận định dạng hình ảnh JPG, PNG hoặc WEBP.',
    }
  }

  if (file.size > MAX_MAP_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'Kích thước ảnh sơ đồ không được vượt quá 5MB.',
    }
  }

  return { valid: true }
}

export type DroppedFilesResult = {
  valid: boolean
  file?: File
  error?: string
}

/**
 * Validates dropped or selected file collections from drag-and-drop or file pickers.
 */
export const validateDroppedFiles = (
  files?: FileList | File[] | null,
): DroppedFilesResult => {
  if (!files || files.length === 0) {
    return {
      valid: false,
      error: 'Không tìm thấy tệp tin hợp lệ. Vui lòng kéo thả tệp tin hình ảnh.',
    }
  }

  if (files.length > 1) {
    return {
      valid: false,
      error: 'Chỉ được chọn 1 tệp ảnh sơ đồ trận đấu.',
    }
  }

  const file = files[0]
  return { valid: true, file }
}

/**
 * Validates whether 100% of all stations defined for the race are placed on the canvas with valid coordinates.
 * - Checks if allBooths is non-empty.
 * - Checks if every booth in allBooths is present in placedBooths with valid numeric mapX and mapY within [0.0, 100.0].
 * - Returns { isValid, missingBoothIds, missingCount, totalCount }.
 */
export const validateAllBoothsPlaced = (
  allBooths: Array<{ boothId: string }>,
  placedBooths: PlacedBoothCoordinate[],
): StationPlacementValidationResult => {
  if (!allBooths || allBooths.length === 0) {
    return {
      isValid: false,
      missingBoothIds: [],
      missingCount: 0,
      totalCount: 0,
    }
  }

  const placedMap = new Map<string, PlacedBoothCoordinate>()
  for (const item of placedBooths) {
    if (item && item.boothId) {
      placedMap.set(item.boothId, item)
    }
  }

  const missingBoothIds: string[] = []
  for (const booth of allBooths) {
    const placed = placedMap.get(booth.boothId)
    const isPlaced =
      placed !== undefined &&
      typeof placed.mapX === 'number' &&
      typeof placed.mapY === 'number' &&
      !Number.isNaN(placed.mapX) &&
      !Number.isNaN(placed.mapY) &&
      placed.mapX >= 0 &&
      placed.mapX <= 100 &&
      placed.mapY >= 0 &&
      placed.mapY <= 100

    if (!isPlaced) {
      missingBoothIds.push(booth.boothId)
    }
  }

  const totalCount = allBooths.length
  const missingCount = missingBoothIds.length
  const isValid = totalCount > 0 && missingCount === 0

  return {
    isValid,
    missingBoothIds,
    missingCount,
    totalCount,
  }
}
