import type {
  RaceBoothItem,
  RaceMapBooth,
  UpdateBoothCoordinatesPayload,
} from './buildMap.contract'
import type { StationItem, StationPin, StationPinState } from './buildMap.types'

/**
 * Maps a backend RaceBoothItem DTO to the frontend StationItem model.
 */
export const mapBoothItemToStation = (booth: RaceBoothItem): StationItem => {
  const isPlaced =
    booth.mapX !== null &&
    booth.mapX !== undefined &&
    booth.mapY !== null &&
    booth.mapY !== undefined &&
    typeof booth.mapX === 'number' &&
    typeof booth.mapY === 'number' &&
    !Number.isNaN(booth.mapX) &&
    !Number.isNaN(booth.mapY)

  return {
    id: booth.boothId,
    name: booth.boothName,
    stationType: booth.isHidden ? 'Trạm ẩn' : 'Trạm thường',
    isHidden: Boolean(booth.isHidden),
    place: booth.boothLocation || 'Chưa có vị trí cụ thể',
    status: booth.status || 'free',
    description: booth.description || '',
    managerName: booth.currentOrganizerName ?? undefined,
    currentTeamName: booth.currentTeamName ?? null,
    currentOrganizerName: booth.currentOrganizerName ?? null,
    mapX: booth.mapX ?? null,
    mapY: booth.mapY ?? null,
    isPlaced,
  }
}

/**
 * Maps an array of backend RaceBoothItem DTOs to an array of frontend StationItem models.
 */
export const mapBoothListToStations = (booths: RaceBoothItem[]): StationItem[] => {
  return booths.map(mapBoothItemToStation)
}

/**
 * Maps a race detail booth array (RaceMapBooth[]) to StationItem models as fallback.
 */
export const mapRaceDetailBoothsToStations = (booths: RaceMapBooth[]): StationItem[] => {
  return booths.map((b) => ({
    id: b.id,
    name: b.name,
    stationType:
      b.stationType || (b.type ? b.type : b.isHidden ? 'Trạm ẩn' : 'Trạm thường'),
    isHidden: Boolean(b.isHidden),
    place: b.place || 'Chưa có vị trí cụ thể',
    status: b.status || 'free',
    description: b.description ?? '',
    managerName: b.organizerID ?? undefined,
    currentTeamName: null,
    currentOrganizerName: b.organizerID ?? null,
    mapX: null,
    mapY: null,
    isPlaced: false,
  }))
}

/**
 * Converts RaceBoothItem DTOs to internal StationPinState for pin placement reducer.
 */
export const mapBoothListToPinState = (booths: RaceBoothItem[]): StationPinState[] => {
  return booths.map((b) => ({
    boothId: b.boothId,
    boothName: b.boothName,
    boothLocation: b.boothLocation || '',
    description: b.description || '',
    status: b.status || 'free',
    isHidden: Boolean(b.isHidden),
    stationType: b.isHidden ? 'Trạm ẩn' : 'Trạm thường',
    currentTeamName: b.currentTeamName ?? null,
    currentOrganizerName: b.currentOrganizerName ?? null,
    mapX: typeof b.mapX === 'number' && !Number.isNaN(b.mapX) ? b.mapX : null,
    mapY: typeof b.mapY === 'number' && !Number.isNaN(b.mapY) ? b.mapY : null,
  }))
}

/**
 * Filters and maps placed booths into StationPin models for canvas rendering.
 */
export const mapBoothListToPins = (booths: RaceBoothItem[]): StationPin[] => {
  return booths
    .filter(
      (b) =>
        b.mapX !== null &&
        b.mapX !== undefined &&
        b.mapY !== null &&
        b.mapY !== undefined &&
        typeof b.mapX === 'number' &&
        typeof b.mapY === 'number' &&
        !Number.isNaN(b.mapX) &&
        !Number.isNaN(b.mapY),
    )
    .map((b, index) => ({
      id: b.boothId,
      name: b.boothName,
      code: `M-${String(index + 1).padStart(2, '0')}`,
      x: Number(b.mapX),
      y: Number(b.mapY),
      status: b.status || 'free',
      isHidden: Boolean(b.isHidden),
      currentTeamName: b.currentTeamName ?? null,
      currentOrganizerName: b.currentOrganizerName ?? null,
    }))
}

/**
 * Converts frontend station items or pin states into the PUT payload for coordinate persistence.
 */
export const mapStationsToCoordinatesPayload = (
  stations: Array<{
    id?: string
    boothId?: string
    mapX?: number | null
    mapY?: number | null
  }>,
): UpdateBoothCoordinatesPayload => {
  return {
    coordinates: stations.map((s) => {
      const boothId = s.boothId || s.id || ''
      const hasX = typeof s.mapX === 'number' && !Number.isNaN(s.mapX)
      const hasY = typeof s.mapY === 'number' && !Number.isNaN(s.mapY)
      return {
        boothId,
        mapX: hasX ? Math.round(s.mapX! * 100) / 100 : null,
        mapY: hasY ? Math.round(s.mapY! * 100) / 100 : null,
      }
    }),
  }
}
