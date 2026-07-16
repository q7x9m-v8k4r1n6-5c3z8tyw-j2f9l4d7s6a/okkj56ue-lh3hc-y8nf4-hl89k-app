import type { RaceLifecycleStatus } from '../model'

/**
 * Logic thuoc entities/race: xac dinh trang thai vong doi cua Race tu thoi gian.
 * Nhung feature khac chi nen dung ham nay, khong dat logic status trong create/edit rieng le.
 */
export const getRaceLifecycleStatus = (
  timeStart?: string,
  timeEnd?: string,
): Exclude<RaceLifecycleStatus, 'draft' | 'cancelled'> => {
  if (!timeStart || !timeEnd) {
    return 'upcoming'
  }

  const now = Date.now()
  const start = new Date(timeStart).getTime()
  const end = new Date(timeEnd).getTime()

  if (Number.isNaN(start) || Number.isNaN(end) || now < start) {
    return 'upcoming'
  }

  if (now <= end) {
    return 'ongoing'
  }

  return 'completed'
}

export const isUpcomingRaceStatus = (
  status: string | undefined,
  timeStart?: string,
  timeEnd?: string,
) => {
  const normalized = status?.toLowerCase()
  if (normalized === 'cancelled' || normalized === 'completed' || normalized === 'ongoing') return false
  if (normalized === 'upcoming') return true

  return getRaceLifecycleStatus(timeStart, timeEnd) === 'upcoming'
}
