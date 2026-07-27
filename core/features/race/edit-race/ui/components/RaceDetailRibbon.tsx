import { TableCard } from '@/core/shared'
import {
  useRaceDetailRibbon,
  type RaceDetailRibbonOptions,
} from '../hooks/useRaceDetailRibbon'

const RibbonAction = ({
  disabled,
  icon,
  label,
  onClick,
}: ReturnType<typeof useRaceDetailRibbon>['actions'][number]) => (
  <button
    type="button"
    className="inline-flex min-h-8 items-center gap-2 rounded-md px-2 text-sm text-[#333333] transition hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-50"
    disabled={disabled}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </button>
)

export const RaceDetailRibbon = (options: RaceDetailRibbonOptions) => {
  const ribbon = useRaceDetailRibbon(options)

  return (
    <TableCard className="rounded-lg border-[#e5e5e5] px-3 py-2 shadow-none">
      <div className="flex min-h-9 flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          {ribbon.actions.map((action) => (
            <span key={action.key} className="contents">
              {action.separatorBefore ? <span className="h-7 w-px bg-[#cfcaca]" /> : null}
              <RibbonAction {...action} />
            </span>
          ))}
        </div>

        <div className="flex items-center gap-5 lg:ml-auto">
          <span className={`rounded-xl px-3 py-1.5 text-sm ${ribbon.statusClassName}`}>
            {ribbon.statusLabel}
          </span>
          <div className="text-right text-sm leading-4 text-[#a6a6a6]">
            <p className="italic">Cập nhật lần cuối:</p>
            <p>{ribbon.modifiedAtText}</p>
          </div>
        </div>
      </div>
    </TableCard>
  )
}
