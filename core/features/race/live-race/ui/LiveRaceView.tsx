import { useLiveRaceView } from './hooks/useLiveRaceView'
import { BoothStatusCard } from './components/BoothStatusCard'
import { EditScoreView } from '../edit-score'
import { LeaderboardCard } from './components/LeaderboardCard'
import { ScoringLogsCard } from './components/ScoringLogsCard'
import { TeamDetailsCard } from './components/TeamDetailsCard'

/**
 * Composes live tracking sections (Leaderboard, Booths, Logs) for the race.
 */
export const LiveRaceView = () => {
  const { raceId, editingTeam, openEditScore, closeEditScore } = useLiveRaceView()

  if (!raceId) return null

  if (editingTeam) {
    return (
      <EditScoreView
        raceId={raceId}
        team={editingTeam}
        onBack={closeEditScore}
      />
    )
  }

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Cột Trái (Rộng hơn - chứa Leaderboard & Booth) */}
      <div className="col-span-1 flex min-h-0 flex-col gap-5 lg:col-span-2">
        <LeaderboardCard raceId={raceId} />
        <BoothStatusCard raceId={raceId} />
      </div>

      {/* Cột Phải (Nhỏ hơn - chứa Team details & Logs) */}
      <div className="col-span-1 flex min-h-0 flex-col gap-5">
        <TeamDetailsCard raceId={raceId} onSelectTeam={openEditScore} />
        <ScoringLogsCard raceId={raceId} />
      </div>
    </div>
  )
}
