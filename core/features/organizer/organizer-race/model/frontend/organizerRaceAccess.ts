import type { RaceSummary } from '@/core/entities/race'

export const ORGANIZER_RACE_UNAVAILABLE_MESSAGE = 'Không thể chọn'

/**
 * Organizer accounts can enter races that are currently running.
 */
export const isOrganizerRaceSelectable = (
  race?: Pick<RaceSummary, 'status'> | null,
) => race?.status === 'ongoing'
