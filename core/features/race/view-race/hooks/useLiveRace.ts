import { useQuery } from '@tanstack/react-query'
import { getBoothScoringLogs, getBoothSummary, getTeamLeaderboard } from '../api'

export const useLiveRace = (raceId?: string) => {
  // Query 1: Lấy Bảng xếp hạng
  const leaderboardQuery = useQuery({
    queryKey: ['live-race', 'leaderboard', raceId],
    queryFn: ({ signal }) => getTeamLeaderboard(raceId!, signal),
    enabled: Boolean(raceId),
  })

  // Query 2: Lấy trạng thái các Trạm
  const boothSummaryQuery = useQuery({
    queryKey: ['live-race', 'booth-summary', raceId],
    queryFn: ({ signal }) => getBoothSummary(raceId!, signal),
    enabled: Boolean(raceId),
  })

  // Query 3: Lấy lịch sử Logs
  const scoringLogsQuery = useQuery({
    queryKey: ['live-race', 'scoring-logs', raceId],
    queryFn: ({ signal }) => getBoothScoringLogs(raceId!, 20, signal),
    enabled: Boolean(raceId),
  })

  return {
    leaderboardQuery,
    boothSummaryQuery,
    scoringLogsQuery,
  }
}