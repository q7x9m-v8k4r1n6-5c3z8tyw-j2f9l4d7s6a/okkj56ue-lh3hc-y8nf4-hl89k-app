import {
  isTeamRaceSelectable,
  TEAM_RACE_UNAVAILABLE_MESSAGE,
} from '../../model/frontend/teamRaceAccess'
import { useTeamRaceDetailQuery } from '../../model/server/useTeamRaceDetailQuery'

/** Combines race detail server state with the team race-entry rule. */
export const useTeamRaceAccess = (raceId?: string) => {
  const raceQuery = useTeamRaceDetailQuery(raceId)
  const race = raceQuery.data
  const isSelectable = isTeamRaceSelectable(race)
  const hasRace = Boolean(race)

  return {
    errorMessage: raceQuery.error instanceof Error
      ? raceQuery.error.message
      : 'Không thể tải thông tin trận đấu.',
    isError: raceQuery.isError || !raceId,
    isLoading: Boolean(raceId) && raceQuery.isPending,
    isUnavailable: hasRace && !isSelectable,
    race,
    raceName: race?.name ?? 'MOVE 2025 - SEVALUX',
    unavailableMessage: TEAM_RACE_UNAVAILABLE_MESSAGE,
  }
}
