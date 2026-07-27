import type { RaceSummary } from '@/core/entities/race'

export const TEAM_RACE_UNAVAILABLE_MESSAGE = 'Không thể chọn'

/**
 * Team accounts can only enter races that are currently running.
 */
export const isTeamRaceSelectable = (
  race?: Pick<RaceSummary, 'status'> | null,
) => race?.status === 'ongoing'
