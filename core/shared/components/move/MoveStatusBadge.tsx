type MoveRaceStatus = 'upcoming' | 'live' | 'done'

const raceStatusMap: Record<MoveRaceStatus, { className: string; label: string }> = {
  live: {
    className: 'bg-[#ecfbf6] text-[#16a34a]',
    label: 'in progress',
  },
  done: {
    className: 'bg-[#f4f4f5] text-[#6b7280]',
    label: 'completed',
  },
  upcoming: {
    className: 'bg-[#fff6ea] text-[#d08a28]',
    label: 'upcoming',
  },
}

export const MoveStatusBadge = ({ label, status }: { status: MoveRaceStatus; label?: string }) => {
  const meta = raceStatusMap[status]

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.64rem] font-semibold capitalize ${meta.className}`}>
      {label ?? meta.label}
    </span>
  )
}

export const MoveDotStatus = ({ status }: { status: 'active' | 'inactive' }) => (
  <span className={`inline-flex items-center gap-2 text-sm ${status === 'inactive' ? 'text-[#6b7280]' : 'text-[#16a34a]'}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${status === 'inactive' ? 'bg-[#9ca3af]' : 'bg-[#22c55e]'}`} />
    {status === 'inactive' ? 'Inactive' : 'Active'}
  </span>
)
