import type { TeamMapRaceDetail, TeamMapBoothItem } from './teamMap.contract'
import type { TeamMapData, StationPin, StationStatus } from './teamMap.types'

/**
 * Normalizes backend booth status into StationStatus for team map pins.
 */
export const mapBoothStatus = (rawStatus?: string): StationStatus => {
  const normalized = (rawStatus ?? '').trim().toLowerCase()
  if (normalized === 'completed' || normalized === 'occupied') return 'completed'
  if (normalized === 'locked') return 'locked'
  if (normalized === 'pending') return 'pending'
  return 'active'
}

/**
 * Pure mapper transforming a single backend booth item into a frontend StationPin.
 * Returns null if the booth is unplaced (mapX or mapY is null/undefined).
 */
export const mapBoothToStationPin = (
  booth: (Partial<TeamMapBoothItem> & {
    id?: string
    name?: string
    place?: string
  }) | null | undefined,
): StationPin | null => {
  if (!booth) return null

  if (
    booth.mapX === null ||
    booth.mapX === undefined ||
    booth.mapY === null ||
    booth.mapY === undefined
  ) {
    return null
  }

  const id = booth.boothId || booth.id || ''
  const name = booth.boothName || booth.name || ''
  const location = booth.boothLocation || booth.place || ''

  const derivedCode =
    location.trim() !== ''
      ? location.trim()
      : name.split(/\s+/).pop() || name.charAt(0) || 'TRẠM'

  return {
    id,
    name,
    code: derivedCode,
    x: Number(booth.mapX),
    y: Number(booth.mapY),
    status: mapBoothStatus(booth.status),
    points: 100,
    description: booth.description?.trim() || location.trim() || '',
    currentTeamName: booth.currentTeamName ?? null,
    currentOrganizerName: booth.currentOrganizerName ?? null,
  }
}

/**
 * Pure mapper converting race detail and booth list DTOs into structured TeamMapData.
 * Filters out hidden booths and unplaced booths (where mapX or mapY is null).
 */
export const mapTeamMapData = (
  raceDetail: TeamMapRaceDetail | null | undefined,
  booths: TeamMapBoothItem[] | null | undefined,
): TeamMapData => {
  const mapImageUrl =
    raceDetail?.mapImageUrl?.trim() ||
    raceDetail?.mapUrl?.trim() ||
    null

  const raceName =
    raceDetail?.raceName?.trim() ||
    raceDetail?.name?.trim() ||
    ''

  const status = raceDetail?.status ?? ''

  const boothList = booths ?? []

  const stations: StationPin[] = boothList
    .filter((booth) => !booth.isHidden && booth.mapX != null && booth.mapY != null)
    .map((booth) => mapBoothToStationPin(booth))
    .filter((pin): pin is StationPin => pin !== null)

  const isEmpty = !mapImageUrl || stations.length === 0

  return {
    raceId: raceDetail?.id ?? '',
    raceName,
    mapImageUrl,
    status,
    stations,
    isEmpty,
  }
}
