/**
 * Test helper functions and types for Drag & Drop Station Pin System & Coordinate Locking test suites.
 */

export interface StationCoordinate {
  boothId: string
  mapX: number | null
  mapY: number | null
}

export interface UpdateBoothCoordinatesPayload {
  coordinates: StationCoordinate[]
}

/**
 * Coordinate calculation helper adhering to relative percentage math:
 * (clientX - canvasLeft) / (canvasWidth * scale) * 100 clamped to [0, 100], rounded to 2 decimal places.
 */
export const calculateRelativeCoordinate = (
  clientPos: number,
  canvasOffset: number,
  canvasDimension: number,
  scale = 1,
): number => {
  if (canvasDimension <= 0) return 0
  const raw = ((clientPos - canvasOffset) / (canvasDimension * scale)) * 100
  const clamped = Math.max(0, Math.min(100, raw))
  return Math.round(clamped * 100) / 100
}

/**
 * Normalizes station initials/codes for teardrop pin labels.
 */
export const getStationInitial = (name?: string): string => {
  if (!name || !name.trim()) return '?'
  const trimmed = name.trim()
  const parts = trimmed.split(/\s+/)
  if (parts.length >= 2) {
    const last = parts[parts.length - 1]
    if (/^[0-9]+$/.test(last) || last.length <= 3) {
      return last
    }
  }
  return trimmed.charAt(0).toUpperCase()
}
