import type {
  EditRaceForm,
  EditRaceFormErrors,
} from './editRace.form'

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

/**
 * Validates frontend editor values before a PATCH request is created.
 */
export const validateEditRaceForm = (
  form: EditRaceForm,
  coverFile: File | null,
): EditRaceFormErrors => {
  const errors: EditRaceFormErrors = { booths: {} }
  const start = new Date(form.timeStart)
  const end = new Date(form.timeEnd)

  if (!form.raceName.trim()) errors.raceName = 'Vui lòng nhập tên trận đấu.'
  if (form.raceName.trim().length > 255) {
    errors.raceName = 'Tên trận đấu không được vượt quá 255 ký tự.'
  }
  if (!form.place.trim()) errors.place = 'Vui lòng nhập địa điểm.'
  if (form.place.trim().length > 255) {
    errors.place = 'Địa điểm không được vượt quá 255 ký tự.'
  }
  if (!form.timeStart || Number.isNaN(start.getTime())) {
    errors.timeStart = 'Thời gian bắt đầu không hợp lệ.'
  }
  if (!form.timeEnd || Number.isNaN(end.getTime())) {
    errors.timeEnd = 'Thời gian kết thúc không hợp lệ.'
  }
  if (
    !errors.timeStart &&
    !errors.timeEnd &&
    end.getTime() <= start.getTime()
  ) {
    errors.timeEnd = 'Thời gian kết thúc phải sau thời gian bắt đầu.'
  }

  if (coverFile) {
    if (!ALLOWED_IMAGE_TYPES.has(coverFile.type)) {
      errors.coverFile = 'Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP.'
    } else if (coverFile.size > MAX_IMAGE_SIZE_BYTES) {
      errors.coverFile = 'Ảnh bìa không được vượt quá 5MB.'
    }
  }

  form.booths.forEach((booth) => {
    const boothErrors: EditRaceFormErrors['booths'][string] = {}
    if (!booth.name.trim()) boothErrors.name = 'Vui lòng nhập tên trạm.'
    if (booth.name.trim().length > 255) {
      boothErrors.name = 'Tên trạm không được vượt quá 255 ký tự.'
    }
    if (!booth.place.trim()) boothErrors.place = 'Vui lòng nhập địa điểm trạm.'
    if (booth.place.trim().length > 255) {
      boothErrors.place = 'Địa điểm trạm không được vượt quá 255 ký tự.'
    }
    if (booth.description.length > 500) {
      boothErrors.description = 'Mô tả không được vượt quá 500 ký tự.'
    }
    if (Object.keys(boothErrors).length) {
      errors.booths[booth.id] = boothErrors
    }
  })

  const managerBooths = new Map<string, string[]>()
  form.booths.forEach((booth) => {
    new Set(booth.managers.map((manager) => manager.id)).forEach(
      (managerId) => {
        managerBooths.set(
          managerId,
          [...(managerBooths.get(managerId) ?? []), booth.id],
        )
      },
    )
  })
  managerBooths.forEach((boothIds) => {
    if (boothIds.length < 2) return
    boothIds.forEach((boothId) => {
      errors.booths[boothId] = {
        ...errors.booths[boothId],
        managers: 'Mỗi quản trạm chỉ được quản lý một trạm.',
      }
    })
  })

  return errors
}

/** Returns true when at least one user-facing validation error exists. */
export const hasEditRaceFormErrors = (errors: EditRaceFormErrors) =>
  Boolean(
    errors.raceName ||
      errors.timeStart ||
      errors.timeEnd ||
      errors.place ||
      errors.coverFile ||
      Object.keys(errors.booths).length,
  )

/**
 * Compares serializable form values. File state is compared separately by the
 * frontend state hook.
 */
export const areEditRaceFormsEqual = (
  left: EditRaceForm,
  right: EditRaceForm,
) => JSON.stringify(left) === JSON.stringify(right)
