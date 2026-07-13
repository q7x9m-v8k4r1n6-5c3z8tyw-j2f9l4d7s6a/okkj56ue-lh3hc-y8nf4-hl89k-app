import { toIsoString } from '@/core/shared'
import type { CreateRaceRequest } from '../models'
import type { BasicDraft, BasicValidationErrors, CreateRaceState, StationDraft, StationValidationErrors } from '../stores/createRaceSlice'

/**
 * Xác thực mô tả trạm chơi có nội dung hay không
 * @param station dòng trạm chơi trong form tạo trận đấu mới
 * @returns true nếu có nội dung, false nếu không có nội dung
 */
export const hasStationContent = (station: Partial<Omit<StationDraft, 'id'>>) => {
  return Boolean(
    station.name?.trim() ||
    station.location?.trim() ||
    station.managers?.length ||
    station.description?.replace(/<[^>]*>/g, '').trim(),
  )
}

/**
 * Build model from local state to request body for create race API
 * @param state local state of create race feature
 * @returns request body for create race API
 */
export const buildCreateRaceRequest = (state: CreateRaceState): CreateRaceRequest => ({
  raceName: state.basic.name.trim(),
  place: state.basic.location.trim(),
  startTime: toIsoString(state.basic.startAt),
  endTime: toIsoString(state.basic.endAt),
  coverUrl: undefined,
  organizerId: state.organizers[0]?.id ?? '',
  raceTeams: state.teams.length ? state.teams.map((team) => ({ teamId: team.id })) : undefined,
  raceBooths: state.stations
    .filter(hasStationContent)
    .map((station) => ({
      boothId: station.id,
      name: station.name.trim(),
      location: station.location.trim(),
      description: station.description || undefined,
      managerIds: station.managers.length ? station.managers.map((manager) => manager.id) : undefined,
    })),
})

/**
 * Validation local state for basic information step in create race
 * @param basic basic information local state
 * @returns validation errors state for basic information step
 */
export const validateBasicStep = (basic: BasicDraft): BasicValidationErrors => {
  const startAt = new Date(basic.startAt)
  const endAt = new Date(basic.endAt)
  const errors: BasicValidationErrors = {}

  if (!basic.name.trim()) errors.name = 'Vui lòng nhập tên trận đấu.'
  if (!basic.startAt) errors.startAt = 'Vui lòng chọn thời gian bắt đầu.'
  if (!basic.endAt) errors.endAt = 'Vui lòng chọn thời gian kết thúc.'
  if (!basic.location.trim()) errors.location = 'Vui lòng nhập địa điểm trận đấu.'

  if (basic.startAt && Number.isNaN(startAt.getTime())) errors.startAt = 'Thời gian bắt đầu không hợp lệ.'
  if (basic.endAt && Number.isNaN(endAt.getTime())) errors.endAt = 'Thời gian kết thúc không hợp lệ.'
  if (
    basic.startAt &&
    basic.endAt &&
    !Number.isNaN(startAt.getTime()) &&
    !Number.isNaN(endAt.getTime()) &&
    endAt <= startAt
  ) {
    errors.endAt = 'Thời gian kết thúc phải sau thời gian bắt đầu.'
  }

  return errors
}

/**
 * Validation local state for station information step in create race
 * @param stations station information local state
 * @returns validation errors state for station information step
 */
export const validateStationStep = (stations: StationDraft[]): StationValidationErrors => {
  const errors: StationValidationErrors = {}

  stations.forEach((station) => {
    if (!hasStationContent(station)) return

    const rowErrors: StationValidationErrors[string] = {}
    if (!station.name.trim()) rowErrors.name = 'Vui lòng nhập tên trạm.'
    if (!station.location.trim()) rowErrors.location = 'Vui lòng nhập địa điểm.'
    if (!station.managers.length) rowErrors.managers = 'Vui lòng chọn ít nhất một quản trạm.'
    if (Object.keys(rowErrors).length) errors[station.id] = rowErrors
  })

  return errors
}