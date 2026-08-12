import type {
  CreateRaceBasicForm,
  CreateRaceFormState,
  CreateRaceStationForm,
} from './createRace.form'

export type BasicValidationErrors =
  Partial<Record<keyof CreateRaceBasicForm, string>>
export type StationValidationErrors =
  Record<string, Partial<Record<'name' | 'location' | 'managers', string>>>

/** Returns whether a station draft contains any user-entered content. */
export const hasStationContent = (
  station: Partial<Omit<CreateRaceStationForm, 'id'>>,
) => Boolean(
  station.name?.trim()
  || station.location?.trim()
  || station.managers?.length
  || station.description?.replace(/<[^>]*>/g, '').trim()
  || station.isHidden
)

/** Validates the basic-information step without reading React state. */
export const validateBasicStep = (
  basic: CreateRaceBasicForm,
): BasicValidationErrors => {
  const errors: BasicValidationErrors = {}
  const startAt = new Date(basic.startAt)
  const endAt = new Date(basic.endAt)

  if (!basic.name.trim()) errors.name = 'Vui lòng nhập tên trận đấu.'
  if (!basic.startAt) errors.startAt = 'Vui lòng chọn thời gian bắt đầu.'
  if (!basic.endAt) errors.endAt = 'Vui lòng chọn thời gian kết thúc.'
  if (!basic.location.trim()) errors.location = 'Vui lòng nhập địa điểm trận đấu.'
  if (!basic.rules.trim()) errors.rules = 'Vui lòng nhập luật trận đấu.'
  if (basic.startAt && Number.isNaN(startAt.getTime())) {
    errors.startAt = 'Thời gian bắt đầu không hợp lệ.'
  }
  if (basic.endAt && Number.isNaN(endAt.getTime())) {
    errors.endAt = 'Thời gian kết thúc không hợp lệ.'
  }
  if (
    basic.startAt
    && basic.endAt
    && !Number.isNaN(startAt.getTime())
    && !Number.isNaN(endAt.getTime())
    && endAt <= startAt
  ) {
    errors.endAt = 'Thời gian kết thúc phải sau thời gian bắt đầu.'
  }

  return errors
}

/** Validates only station rows that the user has started editing. */
export const validateStationStep = (
  stations: CreateRaceStationForm[],
): StationValidationErrors => {
  const errors: StationValidationErrors = {}

  stations.forEach((station) => {
    if (!hasStationContent(station)) return

    const rowErrors: StationValidationErrors[string] = {}
    if (!station.name.trim()) rowErrors.name = 'Vui lòng nhập tên trạm.'
    if (!station.location.trim()) rowErrors.location = 'Vui lòng nhập địa điểm.'
    if (!station.managers.length) {
      rowErrors.managers = 'Vui lòng chọn ít nhất một quản trạm.'
    }
    if (Object.keys(rowErrors).length) errors[station.id] = rowErrors
  })

  const managerStations = new Map<string, string[]>()
  stations.forEach((station) => {
    new Set(station.managers.map((manager) => manager.id)).forEach(
      (managerId) => {
        managerStations.set(
          managerId,
          [...(managerStations.get(managerId) ?? []), station.id],
        )
      },
    )
  })
  managerStations.forEach((stationIds) => {
    if (stationIds.length < 2) return
    stationIds.forEach((stationId) => {
      errors[stationId] = {
        ...errors[stationId],
        managers: 'Mỗi quản trạm chỉ được quản lý một trạm.',
      }
    })
  })

  return errors
}

/** Reports whether a validation error map contains at least one error. */
export const hasValidationErrors = (
  errors: CreateRaceFormState['errors']['basic']
    | CreateRaceFormState['errors']['stations'],
) => Object.keys(errors).length > 0
