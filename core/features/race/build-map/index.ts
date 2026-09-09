export { AdminBuildMapView } from './ui/AdminBuildMapView'
export type { AdminBuildMapViewProps } from './ui/AdminBuildMapView'

export { AdminMapCanvas } from './ui/AdminMapCanvas'
export type { AdminMapCanvasProps } from './ui/AdminMapCanvas'

export { AdminStationPin } from './ui/AdminStationPin'
export type { AdminStationPinProps } from './ui/AdminStationPin'

export { StationSidebar } from './ui/StationSidebar'
export type { StationSidebarProps } from './ui/StationSidebar'

export { CoordinateLockControls } from './ui/CoordinateLockControls'
export type { CoordinateLockControlsProps } from './ui/CoordinateLockControls'

export { FrozenMapBanner } from './ui/FrozenMapBanner'
export type { FrozenMapBannerProps } from './ui/FrozenMapBanner'

export { MapSettingsSection } from './ui/MapSettingsSection'
export type {
  MapSettingsSectionProps,
  MapSettingsValues,
} from './ui/MapSettingsSection'

export {
  calculatePinCoordinates,
  isDropOutsideCanvas,
  clamp,
} from './model/calculatePinCoordinates'
export type {
  CalculatePinCoordinatesParams,
  PinCoordinates,
  CanvasRectBounds,
} from './model/calculatePinCoordinates'

export { usePinPlacementState } from './model/frontend/usePinPlacementState'
export type { UsePinPlacementStateProps } from './model/frontend/usePinPlacementState'

export {
  useMapDraftStorage,
  saveMapDraft,
  loadMapDraft,
  clearMapDraft,
} from './model/frontend/useMapDraftStorage'
export type { PinCoordinateRecord } from './model/frontend/useMapDraftStorage'

export {
  raceBoothItemSchema,
  boothCoordinateItemSchema,
  updateBoothCoordinatesPayloadSchema,
  raceMapDetailResponseSchema,
  raceBoothsResponseSchema,
  uploadRaceMapResponseSchema,
  raceMapSettingsSchema,
  updateRaceMapSettingsPayloadSchema,
} from './model/buildMap.contract'
export type {
  RaceBoothItem,
  BoothCoordinateItem,
  UpdateBoothCoordinatesPayload,
  RaceMapDetailResponse,
  RaceBoothsResponse,
  UploadRaceMapResponse,
  RaceMapSettings,
  UpdateRaceMapSettingsPayload,
} from './model/buildMap.contract'

export {
  validateAllBoothsPlaced,
  isValidMapImageFile,
  validateDroppedFiles,
  MAX_MAP_FILE_SIZE_BYTES,
  ALLOWED_MAP_IMAGE_TYPES,
} from './model/buildMap.validation'
export type {
  PlacedBoothCoordinate,
  StationPlacementValidationResult,
  ValidationResult,
  MapImageValidationResult,
  DroppedFilesResult,
} from './model/buildMap.validation'

export {
  useUpdateBoothCoordinatesMutation,
  getUpdateBoothCoordinatesMutationOptions,
} from './model/server/useUpdateBoothCoordinatesMutation'

export {
  useUpdateRaceMapSettingsMutation,
  getUpdateRaceMapSettingsMutationOptions,
} from './model/server/useUpdateRaceMapSettingsMutation'

export {
  updateBoothCoordinates,
  updateRaceMapSettings,
  getRaceMapDetail,
  getRaceBooths,
  uploadRaceMap,
} from './api/buildMap.api'
