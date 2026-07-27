import {
  Badge,
  formatDateTime,
  TableCard,
  type BadgeVariant,
} from '@/core/shared'
import { DefaultCoverImage } from '@/core/assets'
import type {
  RaceStatus,
  RaceSummary,
} from '../model/race'

const statusMeta = {
  draft: { label: 'Nháp', variant: 'neutral' },
  ready: { label: 'Sẵn sàng bắt đầu', variant: 'success' },
  ongoing: { label: 'Đang diễn ra', variant: 'primary' },
  paused: { label: 'Tạm dừng', variant: 'warning' },
  completed: { label: 'Đã kết thúc', variant: 'danger' },
} satisfies Record<RaceStatus, {
  label: string
  variant: BadgeVariant
}>

export type RaceCardProps = {
  disabled?: boolean
  disabledReason?: string
  onSelect: (raceId: string) => void
  race: RaceSummary
}

/**
 * Renders a reusable race summary.
 *
 * Navigation stays in the consuming feature through onSelect, keeping the
 * entity independent from application routes and feature workflows.
 */
export const RaceCard = ({
  disabled = false,
  disabledReason,
  onSelect,
  race,
}: RaceCardProps) => {
  const status = statusMeta[race.status]
  const coverUrl = race.coverUrl || DefaultCoverImage()

  return (
    <TableCard className={`transition-shadow ${disabled ? 'opacity-80' : 'hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)]'}`}>
      <button
        type="button"
        className={`grid w-full text-left md:grid-cols-[162px_minmax(0,1fr)] ${disabled ? 'cursor-not-allowed' : ''}`}
        disabled={disabled}
        onClick={() => onSelect(race.id)}
      >
        <img
          src={coverUrl}
          alt={`Ảnh bìa ${race.name}`}
          className="h-[194px] w-full object-cover"
        />

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
              {disabledReason ? (
                <span className="ml-auto text-sm font-medium text-[#de3336]">
                  {disabledReason}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </button>
    </TableCard>
  )
}
