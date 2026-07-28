import {
  isOrganizerRaceSelectable,
  ORGANIZER_RACE_UNAVAILABLE_MESSAGE,
} from '../../model/frontend/organizerRaceAccess'
import { useOrganizerRaceDetailQuery } from '../../model/server/useOrganizerRaceDetailQuery'

/** Combines race detail server state with the organizer race-entry rule. */
export const useOrganizerRaceAccess = (raceId?: string) => {
  const raceQuery = useOrganizerRaceDetailQuery(raceId)
  const race = raceQuery.data
  const isSelectable = isOrganizerRaceSelectable(race)
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
    unavailableMessage: ORGANIZER_RACE_UNAVAILABLE_MESSAGE,
  }
}
