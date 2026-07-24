import { useLiveRace } from '../hooks'
import { BoothStatusCard, LeaderboardCard, ScoringLogsCard, TeamDetailsCard } from './components'

export const LiveRaceView = ({ raceId }: { raceId?: string }) => {
  // Gọi Custom Hook để lấy trạng thái Loading và Data của cả 3 API
  const { leaderboardQuery, boothSummaryQuery, scoringLogsQuery } = useLiveRace(raceId)

  return (
    // min-h-0 ở đây vô cùng quan trọng để hệ thống biết mà kích hoạt thanh cuộn của phần tử con
    <div className="grid h-full min-h-0 grid-cols-1 gap-6 lg:grid-cols-3">
      
      {/* Cột Trái (Rộng hơn - chứa Leaderboard & Booth) */}
      <div className="col-span-1 flex min-h-0 flex-col gap-8 lg:col-span-2">
        <LeaderboardCard data={leaderboardQuery.data} isLoading={leaderboardQuery.isLoading} />
        <BoothStatusCard data={boothSummaryQuery.data} isLoading={boothSummaryQuery.isLoading} />
      </div>

      {/* Cột Phải (Nhỏ hơn - chứa Team details & Logs) */}
      <div className="col-span-1 flex min-h-0 flex-col gap-8">
        <TeamDetailsCard />
        <ScoringLogsCard data={scoringLogsQuery.data} isLoading={scoringLogsQuery.isLoading} />
      </div>
      
    </div>
  )
}