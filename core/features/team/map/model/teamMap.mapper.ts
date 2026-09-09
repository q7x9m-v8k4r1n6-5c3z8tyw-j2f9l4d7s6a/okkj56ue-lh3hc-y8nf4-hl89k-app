import type { TeamMapDetailResponse } from './teamMap.contract'
import type { MapData, StationPin } from './teamMap.types'

const isSecretBooth = (isHidden: unknown): boolean => {
  if (typeof isHidden === 'boolean') return isHidden
  if (typeof isHidden === 'string') {
    const normalized = isHidden.trim().toLowerCase()
    return normalized === 'true' || normalized === '1'
  }
  if (typeof isHidden === 'number') return isHidden === 1
  return Boolean(isHidden)
}

/**
 * Pure mapper converting race detail API response to client MapData.
 * Respects isShowHiddenBooths (includes secret booths when true, filters them out when false).
 * Filters out booths lacking coordinates.
 * Respects isDisabledBoothStatus (forces all station pins to 'occupied' when true).
 */
export const mapRaceDetailToMapData = (
  response: TeamMapDetailResponse | null | undefined,
): MapData => {
  if (!response) {
    return {
      backgroundImageUrl: '',
      stations: [],
      isHideBoothDescription: false,
      isDisabledBoothStatus: false,
    }
  }

  const backgroundImageUrl = response.mapImageUrl?.trim() || ''
  const booths = response.booth ?? []
  const isShowHiddenBooths = Boolean(response.isShowHiddenBooths)
  const isHideBoothDescription = Boolean(response.isHideBoothDescription)
  const isDisabledBoothStatus = Boolean(response.isDisabledBoothStatus)

  const stations: StationPin[] = booths
    .filter(
      (booth) =>
        (isShowHiddenBooths || !isSecretBooth(booth.isHidden)) &&
        booth.mapX != null &&
        booth.mapY != null &&
        Number.isFinite(booth.mapX) &&
        Number.isFinite(booth.mapY),
    )
    .map((booth, index) => ({
      id: booth.id?.trim() || `station-${index + 1}`,
      name: booth.name,
      place: booth.place,
      description: booth.description,
      x: Math.max(0, Math.min(100, booth.mapX!)),
      y: Math.max(0, Math.min(100, booth.mapY!)),
      status: isDisabledBoothStatus
        ? 'occupied'
        : booth.status?.trim().toLowerCase() === 'occupied'
          ? 'occupied'
          : 'free',
    }))

  return {
    backgroundImageUrl,
    stations,
    isHideBoothDescription,
    isDisabledBoothStatus,
  }
}
