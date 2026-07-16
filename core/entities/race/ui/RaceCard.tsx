import { Badge, Button, TableCard } from '@/core/shared'
import { DefaultCoverImage } from '@/core/assets'
import { useRaceHooks } from '../hooks'
import type { RaceModel } from '../model'

const statusMeta = {
  active: { label: 'Active', variant: 'primary' },
  draft: { label: 'In progress', variant: 'success' },
  upcoming: { label: 'Upcoming', variant: 'warning' },
  ongoing: { label: 'Ongoing', variant: 'primary' },
  completed: { label: 'Completed', variant: 'neutral' },
  cancelled: { label: 'Cancelled', variant: 'warning' },
} as const

export type RaceCardRecord = RaceModel
export type RaceCardStatus = keyof typeof statusMeta

type RaceCardProps = {
  race: RaceModel
  onEdit?: (race: RaceModel) => void
}

export const RaceCard = ({ onEdit, race }: RaceCardProps) => {
  const rawStatus = (race.status ?? 'draft').toLowerCase()
  const status = statusMeta[rawStatus as RaceCardStatus] ?? statusMeta['active']
  const { onDetailRaceView } = useRaceHooks()
  const canEdit = rawStatus === 'upcoming'
  const openDetail = () => onDetailRaceView(race.id)

  return (
    <TableCard className="transition-shadow hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)]">
      <div
        className="grid w-full cursor-pointer text-left md:grid-cols-[162px_minmax(0,1fr)]"
        role="button"
        tabIndex={0}
        onClick={openDetail}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') openDetail()
        }}
      >
        <img src={DefaultCoverImage()} alt={`Cover ${race.name}`} className="h-[194px] w-full object-cover" />

        <div className="min-w-0 px-6 py-4">
          <div className="space-y-2">
            <h2 className="truncate text-lg font-medium text-black">{race.name}</h2>
            <dl className="text-sm text-[#666666]">
              <div>Địa điểm: {race.place || 'Chưa cập nhật'}</div>
              <div>Thời gian bắt đầu: {race.timeStart || '-'}</div>
              <div>Thời gian kết thúc: {race.timeEnd || '-'}</div>
            </dl>
          </div>

          <div className="mt-[18px] border-t-2 border-[#eeeeee] pt-[18px]">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[#666666]">
              <div className="flex items-center gap-4">
                <span>Trạng thái:</span>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
              {canEdit && onEdit ? (
                <Button
                  onClick={(event) => {
                    event.stopPropagation()
                    onEdit(race)
                  }}
                >
                  Chỉnh sửa
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  )
}
