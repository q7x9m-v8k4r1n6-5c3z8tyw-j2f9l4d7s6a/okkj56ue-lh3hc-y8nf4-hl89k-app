import { FormatListBulletedIcon } from '@/core/assets/icons'
import { Button, Skeleton } from '@/core/shared'
import type { RaceBoothItem } from '../model/buildMap.contract'

export type StationSidebarProps = {
  booths: RaceBoothItem[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

/**
 * Left sidebar displaying the list of race stations/booths according to Figma node 1719:1420.
 */
export const StationSidebar = ({
  booths,
  isLoading = false,
  isError = false,
  onRetry,
}: StationSidebarProps) => {
  return (
    <div className="flex h-auto lg:h-full w-full flex-col gap-2.5 shrink-0 lg:w-[408px]">
      {/* Header matching Figma node 1719:1421 */}
      <div className="flex items-center gap-2.5 shrink-0 py-0.5">
        <FormatListBulletedIcon className="size-6 text-[#040000] shrink-0" />
        <h3 className="text-base font-semibold leading-7 text-[#040000]">
          Danh sách các trạm
        </h3>
      </div>

      {/* Main station list container matching Figma node 1719:1425 */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-[10px] border border-[#e5e5e5] bg-white min-h-[380px]">
        {isLoading ? (
          <div className="flex flex-col p-4.5 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 pb-3.5 border-b border-[#dcc0bd]/30 last:border-b-0"
              >
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3.5 w-20" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center gap-3">
            <p className="text-sm text-[#de3336]">Không thể tải danh sách trạm.</p>
            {onRetry && (
              <Button variant="secondary" size="sm" onClick={onRetry}>
                Thử lại
              </Button>
            )}
          </div>
        ) : booths.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-[#5e5e5e]">
            Chưa có trạm nào trong trận đấu.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4.5 py-1 divide-y divide-[#dcc0bd]/30">
            {booths.map((booth) => (
              <div
                key={booth.boothId}
                className="flex flex-col gap-1.5 py-3.5 hover:bg-[#fafafa] rounded transition-colors"
              >
                <div className="text-base font-normal text-[#1a1c1c] leading-snug break-words">
                  {booth.boothName}
                </div>
                <div>
                  <span
                    className={
                      booth.isHidden
                        ? 'inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700'
                        : 'inline-flex items-center rounded-full bg-[#f5f5f5] px-2 py-0.5 text-[11px] font-medium text-[#5e5e5e]'
                    }
                  >
                    {booth.isHidden ? 'Trạm ẩn' : 'Trạm thường'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
