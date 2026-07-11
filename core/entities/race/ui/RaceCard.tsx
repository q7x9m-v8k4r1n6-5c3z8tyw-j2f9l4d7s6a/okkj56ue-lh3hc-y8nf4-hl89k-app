import { MoveButton, MoveStatusBadge } from '@/core/shared'
import type { MoveRaceRecord } from '@/core/shared/lib'

type RaceCardProps = {
  race: MoveRaceRecord
  onEdit: () => void
  onView: () => void
}

const getArtwork = (raceId: number) => {
  const palettes = [
    ['#341b52', '#4c76c6', '#f5c77c'],
    ['#6b2d11', '#d8a44e', '#efe2c8'],
    ['#681012', '#e76b2f', '#ffd66f'],
    ['#143c73', '#3f8fd4', '#d6e6fb'],
  ]
  const palette = palettes[raceId % palettes.length]
  const svg = [
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'>",
    "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>",
    `<stop offset='0%' stop-color='${palette[0]}'/>`,
    `<stop offset='55%' stop-color='${palette[1]}'/>`,
    `<stop offset='100%' stop-color='${palette[2]}'/>`,
    '</linearGradient></defs>',
    "<rect width='160' height='160' rx='18' fill='url(#g)'/>",
    "<circle cx='122' cy='36' r='18' fill='rgba(255,255,255,0.16)'/>",
    "<path d='M8 138C38 120 72 106 100 90c18-10 33-23 52-41v111H8Z' fill='rgba(15,23,42,0.28)'/>",
    "<path d='M14 148c25-19 48-29 71-37 21-7 39-19 61-42v79H14Z' fill='rgba(255,255,255,0.14)'/>",
    "<text x='18' y='136' font-size='20' font-family='Arial, sans-serif' font-weight='700' fill='white'>MOVE</text>",
    '</svg>',
  ].join('')

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export const RaceCard = ({ onEdit, onView, race }: RaceCardProps) => {
  return (
    <article className="rounded-[1.25rem] border border-[#efe8e5] bg-white px-4 py-5 transition hover:border-[#e8ddda]">
      <div className="grid gap-4 md:grid-cols-[5rem_1fr_auto] md:items-start">
        <img
          src={getArtwork(race.id)}
          alt={`Cover ${race.name}`}
          className="h-24 w-20 rounded-xl object-cover shadow-[0_10px_22px_rgba(15,23,42,0.08)]"
        />

        <div className="min-w-0">
          <h2 className="truncate text-[0.95rem] font-semibold text-[#222226]">{race.name}</h2>

          <dl className="mt-2 space-y-1 text-[0.72rem] text-[#8b8580]">
            <div><span className="font-medium text-[#6c6763]">Địa điểm:</span> {race.location || 'Chưa cập nhật'}</div>
            <div><span className="font-medium text-[#6c6763]">Thời gian bắt đầu:</span> {race.startText || race.startAt || '-'}</div>
            <div><span className="font-medium text-[#6c6763]">Thời gian kết thúc:</span> {race.endText || race.endAt || '-'}</div>
          </dl>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[0.72rem] text-[#8b8580]">Trạng thái</span>
            <MoveStatusBadge status={race.status} />
          </div>
        </div>

        <div className="flex items-start justify-end gap-2 md:flex-col">
          <MoveButton variant="secondary" size="xs" onClick={onView}>Chi tiết</MoveButton>
          <MoveButton size="xs" onClick={onEdit}>Chỉnh sửa</MoveButton>
        </div>
      </div>
    </article>
  )
}
