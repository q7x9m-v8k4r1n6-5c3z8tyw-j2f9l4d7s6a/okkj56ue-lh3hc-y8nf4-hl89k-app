import type { TeamBoothSession } from '@/core/entities/booth'

type TeamBoothSessionCardProps = {
  session: TeamBoothSession
}

export const TeamBoothSessionCard = ({ session }: TeamBoothSessionCardProps) => (
  <article className="mt-6 w-full rounded-xl border border-[#e5e5e5] bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8a8a]">
          Phiên trạm hiện tại
        </p>
        <h2 className="mt-1 truncate text-lg font-bold text-[#323232]">
          {session.boothName}
        </h2>
      </div>
      <span className="shrink-0 rounded-full bg-[#de3336]/10 px-3 py-1 text-xs font-semibold text-[#b7282b]">
        {session.isHidden ? 'Trạm ẩn' : 'Trạm thường'}
      </span>
    </div>

    {session.place ? (
      <p className="mt-3 text-sm text-[#5e5e5e]">
        <span className="font-semibold">Địa điểm:</span> {session.place}
      </p>
    ) : null}
    {session.description ? (
      <p className="mt-2 whitespace-pre-line text-sm leading-5 text-[#6b6b6b]">
        {session.description}
      </p>
    ) : null}
  </article>
)
