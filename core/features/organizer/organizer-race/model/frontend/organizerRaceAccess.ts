import type { RaceSummary } from '@/core/entities/race'

const ORGANIZER_VISIBLE_RACE_STATUSES = new Set([
  'ongoing',
  'paused',
  'completed',
])

export const ORGANIZER_RACE_UNAVAILABLE_MESSAGE = 'Không thể chọn'

/**
 * Organizer accounts can enter races that are currently running.
 */
export const isOrganizerRaceSelectable = (
  race?: Pick<RaceSummary, 'status'> | null,
) => race?.status === 'ongoing'

export const isOrganizerRaceVisible = (
  race?: Pick<RaceSummary, 'status'> | null,
) => Boolean(race?.status && ORGANIZER_VISIBLE_RACE_STATUSES.has(race.status))
