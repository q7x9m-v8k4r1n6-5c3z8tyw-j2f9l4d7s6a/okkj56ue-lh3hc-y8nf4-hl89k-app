import type { RaceSummary } from '@/core/entities/race'

const TEAM_VISIBLE_RACE_STATUSES = new Set([
  'ongoing',
  'paused',
  'completed',
])

export const TEAM_RACE_UNAVAILABLE_MESSAGE = 'Không thể chọn'

/**
 * Team accounts can only enter races that are currently running.
 */
export const isTeamRaceSelectable = (
  race?: Pick<RaceSummary, 'status'> | null,
) => race?.status === 'ongoing'

export const isTeamRaceVisible = (
  race?: Pick<RaceSummary, 'status'> | null,
) => Boolean(race?.status && TEAM_VISIBLE_RACE_STATUSES.has(race.status))
