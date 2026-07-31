import { useLiveRaceView } from './hooks/useLiveRaceView'
import { BoothStatusCard } from './components/BoothStatusCard'
import { LeaderboardCard } from './components/LeaderboardCard'
import { ScoringLogsCard } from './components/ScoringLogsCard'
import { TeamDetailsCard } from './components/TeamDetailsCard'

/**
 * Composes live tracking sections (Leaderboard, Booths, Logs) for the race.
 */
export const LiveRaceView = () => {
  const { raceId } = useLiveRaceView()

  if (!raceId) return null

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Cột Trái (Rộng hơn - chứa Leaderboard & Booth) */}
      <div className="col-span-1 flex min-h-0 flex-col gap-5 lg:col-span-2">
        <LeaderboardCard raceId={raceId} />
        <BoothStatusCard raceId={raceId} />
      </div>

      {/* Cột Phải (Nhỏ hơn - chứa Team details & Logs) */}
      <div className="col-span-1 flex min-h-0 flex-col gap-5">
        <TeamDetailsCard />
        <ScoringLogsCard raceId={raceId} />
      </div>
    </div>
  )
}