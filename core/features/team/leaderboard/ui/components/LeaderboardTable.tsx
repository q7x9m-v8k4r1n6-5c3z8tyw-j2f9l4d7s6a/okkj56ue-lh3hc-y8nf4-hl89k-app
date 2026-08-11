import type { TeamLeaderboardResponse } from '../../model/teamLeaderboard.contract'
import { formatLeaderboardRank } from '../../model/teamLeaderboard.presentation'

type LeaderboardTableProps = {
  areOtherTeamPointsHidden: boolean
  isVisible: boolean
  teams: TeamLeaderboardResponse['teams']
}

export const LeaderboardTable = ({
  areOtherTeamPointsHidden,
  isVisible,
  teams,
}: LeaderboardTableProps) => {
  if (!isVisible) {
    return (
      <div className="rounded-[10px] border border-[#e5e5e5] px-5 py-10 text-center text-sm text-[#737373]">
        Ban tổ chức chưa mở bảng xếp hạng.
      </div>
    )
  }

  return (
    <section aria-label="Bảng xếp hạng các đội">
      {areOtherTeamPointsHidden ? (
        <p className="mb-3 text-center text-xs text-[#737373]">
          Điểm của các đội khác đang được ẩn.
        </p>
      ) : null}
      <div className="overflow-hidden rounded-t-[18px] bg-white">
        <div className="grid min-h-[58px] grid-cols-[64px_minmax(0,1fr)_72px] items-center bg-[#de3336] text-center text-xs font-semibold uppercase text-white">
          <span>Hạng</span>
          <span>Tên đội</span>
          <span>Điểm</span>
        </div>
        {teams.length === 0 ? (
          <p className="py-10 text-center text-sm text-[#737373]">
            Chưa có dữ liệu xếp hạng.
          </p>
        ) : teams.map((team) => (
          <div
            key={team.teamId}
            className={`grid min-h-[72px] grid-cols-[64px_minmax(0,1fr)_72px] items-center text-center text-sm text-[#666] ${
              team.isCurrentTeam ? 'bg-[#fff7f7] font-medium' : 'bg-white'
            }`}
          >
            <span>{formatLeaderboardRank(team.rank)}</span>
            <span className="truncate px-2">{team.displayName}</span>
            <span>{team.totalScore ?? '—'}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
