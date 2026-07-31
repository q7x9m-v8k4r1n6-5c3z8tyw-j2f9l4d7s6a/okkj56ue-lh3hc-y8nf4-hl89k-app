import type { LiveRaceSelectedTeam } from '../../model/liveRace.selection'
import { useLeaderboardQuery } from '../../model/server/useLiveQueries'

type UseTeamDetailsSectionOptions = {
  raceId?: string
  onSelectTeam: (team: LiveRaceSelectedTeam) => void
}

export const useTeamDetailsSection = ({
  raceId,
  onSelectTeam,
}: UseTeamDetailsSectionOptions) => {
  const query = useLeaderboardQuery(raceId)
  const teams: LiveRaceSelectedTeam[] = (query.data ?? []).map((team, index) => ({
    ...team,
    rank: index + 1,
  }))

  return {
    teams,
    isLoading: query.isLoading,
    isError: query.isError,
    emptyMessage: query.isError ? 'Không thể tải danh sách đội.' : 'Chưa có đội chơi.',
    selectTeam: onSelectTeam,
  }
}
