/**
 * Pure coordinate calculation helper for mapping mouse/pointer coordinates
 * to percentage-based coordinates [0.00, 100.00] on the race map canvas,
 * taking into account zoom scale and pan offsets from TransformWrapper.
 */

export interface CalculatePinCoordinatesParams {
  clientX: number
  clientY: number
  mapRect: {
    left: number
    top: number
    width: number
    height: number
  }
  positionX: number
  positionY: number
  scale: number
}

export interface PinCoordinates {
  mapX: number
  mapY: number
}

export interface CanvasRectBounds {
  left: number
  top: number
  right?: number
  bottom?: number
  width?: number
  height?: number
}

/**
 * Clamps a numerical value between min and max bounds.
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val))
}

/**
 * Calculates percentage coordinates [0.00, 100.00] on the map relative to its original dimensions,
 * compensating for pan offset (positionX, positionY) and zoom scale.
 */
export function calculatePinCoordinates({
  clientX,
  clientY,
  mapRect,
  positionX,
  positionY,
  scale,
}: CalculatePinCoordinatesParams): PinCoordinates {
  if (mapRect.width <= 0 || mapRect.height <= 0 || scale <= 0) {
    return { mapX: 0, mapY: 0 }
  }

  // Calculate mouse offset relative to unscaled image origin
  const rawX = ((clientX - mapRect.left - positionX) / (mapRect.width * scale)) * 100
  const rawY = ((clientY - mapRect.top - positionY) / (mapRect.height * scale)) * 100

  // Clamp to [0, 100] and round to 2 decimal places
  const mapX = Math.round(clamp(rawX, 0, 100) * 100) / 100
  const mapY = Math.round(clamp(rawY, 0, 100) * 100) / 100

  return { mapX, mapY }
}

/**
 * Checks whether the given client coordinates fall outside the canvas boundary.
 */
export function isDropOutsideCanvas(
  clientX: number,
  clientY: number,
  canvasRect: CanvasRectBounds,
): boolean {
  const right = canvasRect.right ?? canvasRect.left + (canvasRect.width ?? 0)
  const bottom = canvasRect.bottom ?? canvasRect.top + (canvasRect.height ?? 0)

  return (
    clientX < canvasRect.left ||
    clientX > right ||
    clientY < canvasRect.top ||
    clientY > bottom
  )
}
