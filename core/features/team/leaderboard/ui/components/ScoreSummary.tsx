import type { TeamLeaderboardResponse } from '../../model/teamLeaderboard.contract'

type ScoreSummaryProps = {
  team: TeamLeaderboardResponse['currentTeam']
}

export const ScoreSummary = ({ team }: ScoreSummaryProps) => (
  <section className="flex flex-col items-center gap-3" aria-label="Điểm hiện tại">
    <div className="flex min-h-[172px] w-full max-w-[285px] flex-col items-center justify-center rounded-[10px] bg-[#166534] px-5 py-6 text-center text-white">
      <p className="text-[16px] font-medium uppercase tracking-[3.2px] text-white/70">
        Số điểm hiện tại
      </p>
      <p className="mt-2 text-5xl font-bold leading-none">{team.totalScore}</p>
      <p className="mt-3 text-base text-white/70">Hạng #{team.rank}</p>
    </div>

    <div className="grid w-full max-w-[285px] grid-cols-2 gap-2 text-center">
      <div className="rounded-[10px] bg-[#f7f7f7] px-2 py-2.5">
        <p className="text-lg font-bold text-[#323232]">
          {team.completedRegularBooths}
        </p>
        <p className="text-[11px] text-[#737373]">Trạm thường</p>
      </div>
      <div className="rounded-[10px] bg-[#f7f7f7] px-2 py-2.5">
        <p className="text-lg font-bold text-[#323232]">
          {team.completedHiddenBooths}
        </p>
        <p className="text-[11px] text-[#737373]">Trạm ẩn</p>
      </div>
    </div>
  </section>
)
