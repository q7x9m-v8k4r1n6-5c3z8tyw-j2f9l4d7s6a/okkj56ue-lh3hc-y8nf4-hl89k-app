import { Badge, formatDateTime, TableCard } from '@/core/shared'
import { DefaultCoverImage } from '@/core/assets'
import { useRaceHooks } from '../hooks'
import type { RaceModel } from '../model'

const statusMeta = {
  draft: { label: 'Nháp', variant: 'neutral' },
  ready: { label: 'Sẵn sàng bắt đầu', variant: 'success' },
  ongoing: { label: 'Đang diễn ra', variant: 'primary' },
  paused: { label: 'Tạm dừng', variant: 'warning' },
  completed: { label: 'Đã kết thúc', variant: 'danger' },
} as const

export type RaceCardRecord = RaceModel
export type RaceCardStatus = keyof typeof statusMeta

export const RaceCard = ({ race }: { race: RaceModel }) => {
  const rawStatus = (race.status ?? 'draft').toLowerCase()
  const status = statusMeta[rawStatus as RaceCardStatus] ?? statusMeta['draft']
  const { onDetailRaceView } = useRaceHooks()

  return (
    <TableCard className="transition-shadow hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)]">
      <button type="button" className="grid w-full text-left md:grid-cols-[162px_minmax(0,1fr)]" onClick={() => onDetailRaceView(race.id)}>
        <img src={DefaultCoverImage()} alt={`Cover ${race.name}`} className="h-[194px] w-full object-cover" />

        <div className="min-w-0 px-6 py-4">
          <div className="space-y-2">
            <h2 className="truncate text-lg font-medium text-black">{race.name}</h2>
            <dl className="text-sm text-[#666666]">
              <div>Địa điểm: {race.place || 'Chưa cập nhật'}</div>
              <div>Thời gian bắt đầu: {race.timeStart ? formatDateTime(race.timeStart) : '-'}</div>
              <div>Thời gian kết thúc: {race.timeEnd ? formatDateTime(race.timeEnd) : '-'}</div>
            </dl>
          </div>

          <div className="mt-[18px] border-t-2 border-[#eeeeee] pt-[18px]">
            <div className="flex items-center gap-4 text-sm text-[#666666]">
              <span>Trạng thái:</span>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
          </div>
        </div>
      </button>
    </TableCard>
  )
}
