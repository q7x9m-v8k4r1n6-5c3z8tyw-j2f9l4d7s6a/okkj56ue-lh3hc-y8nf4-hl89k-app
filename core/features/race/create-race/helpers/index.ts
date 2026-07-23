import { getCurrentGmt7DateTime, toGmt7ApiDateTime } from '@/core/shared'
import type { CreateRaceRequest } from '../models'
import type { BasicDraft, BasicValidationErrors, CreateRaceState, StationDraft, StationValidationErrors } from '../stores/createRaceSlice'

export const hasStationContent = (station: Partial<Omit<StationDraft, 'id'>>) => {
  return Boolean(
    station.name?.trim() ||
    station.location?.trim() ||
    station.managers?.length ||
    station.description?.replace(/<[^>]*>/g, '').trim(),
  )
}

export const buildCreateRaceRequest = (state: CreateRaceState): CreateRaceRequest => ({
  raceName: state.basic?.name?.trim() ?? '',
  place: state.basic?.location?.trim() ?? '',
  status: 'draft',
  timeStart: state.basic?.startAt ? toGmt7ApiDateTime(state.basic.startAt) : getCurrentGmt7DateTime(),
  timeEnd: state.basic?.endAt ? toGmt7ApiDateTime(state.basic.endAt) : getCurrentGmt7DateTime(),
  isToggledLeaderboard: state.settings?.disableLeaderboard ?? false,
  isHiddenPoint: state.settings?.hideScores ?? false,
  coverUrl: state.basic?.coverUrl || undefined,
  organizerId: state.organizers?.map((o) => o.id) || [],
  raceTeam: state.teams?.map((t) => ({ teamID: t.id })) || [],
  booth: (state.stations || [])
    .filter(hasStationContent)
    .map((station) => ({
      name: station.name?.trim() ?? '',
      place: station.location?.trim() ?? '',
      description: station.description || undefined,
      organizerID: station.managers?.map((manager) => manager.id).join('|') || '',
    })),
})

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
