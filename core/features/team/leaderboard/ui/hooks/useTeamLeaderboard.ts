import { useParams } from 'react-router-dom'
import { useTeamResultsTab } from '../../model/frontend/useTeamResultsTab'
import {
  useTeamLeaderboardQuery,
  useTeamScoreHistoryQuery,
} from '../../model/server/useTeamLeaderboardQueries'
import { useTeamLeaderboardSignalR } from '../../model/server/useTeamLeaderboardSignalR'
import { mapScoreHistoryItem } from '../../model/teamLeaderboard.presentation'

/** Composes result-screen server state without copying it into local state. */
export const useTeamLeaderboard = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const tabs = useTeamResultsTab()
  const leaderboard = useTeamLeaderboardQuery(raceId)
  const history = useTeamScoreHistoryQuery(raceId, tabs.activeTab === 'score')

  useTeamLeaderboardSignalR(raceId)

  return {
    activeTab: tabs.activeTab,
    areOtherTeamPointsHidden:
      leaderboard.data?.areOtherTeamPointsHidden ?? false,
    currentTeam: leaderboard.data?.currentTeam,
    historyItems: history.data?.pages
      .flatMap((page) => page.items)
      .map(mapScoreHistoryItem) ?? [],
    isHistoryError: history.isError,
    isHistoryLoading: history.isLoading,
    isHistoryLoadingMore: history.isFetchingNextPage,
    isLeaderboardError: leaderboard.isError,
    isLeaderboardLoading: leaderboard.isLoading,
    isLeaderboardVisible: leaderboard.data?.isLeaderboardVisible ?? false,
    loadMoreHistory: () => history.fetchNextPage(),
    hasMoreHistory: history.hasNextPage,
    retryHistory: () => history.refetch(),
    retryLeaderboard: () => leaderboard.refetch(),
    setActiveTab: tabs.setActiveTab,
    teams: leaderboard.data?.teams ?? [],
  }
}
