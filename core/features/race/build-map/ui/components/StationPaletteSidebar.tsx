import type { StationItem } from '../../model/buildMap.types'

export interface StationPaletteSidebarProps {
  stations: StationItem[]
  isLoading?: boolean
  className?: string
}

/**
 * Left Column Sidebar: Station Palette displaying all stations/booths configured for the race.
 * Conforms to Figma Node 1719-1328 (Node 1719:1420).
 * Displays:
 * - Header: List Icon + "Danh sách các trạm"
 * - Flat list of station cards with border-[#e5e5e5] and rounded-[10px]
 * - Each item displays exactly 2 lines:
 *   Line 1: Station name (color #111827)
 *   Line 2: Station type (color #8a8a8a)
 */
export const StationPaletteSidebar = ({
  stations = [],
  isLoading = false,
  className = '',
}: StationPaletteSidebarProps) => {
  return (
    <aside
      className={`flex w-full lg:w-[360px] xl:w-[408px] shrink-0 flex-col gap-2.5 ${className}`}
      aria-label="Danh sách các trạm"
    >
      {/* Sidebar Header (Figma Node 1719:1421) */}
      <div className="flex items-center gap-2.5">
        <svg
          className="h-5 w-5 shrink-0 text-[#111827]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        <h3 className="text-base font-semibold text-[#040000]">
          Danh sách các trạm
        </h3>
      </div>

      {/* Station List Container (Figma Node 1719:1425) */}
      <div className="flex w-full flex-col rounded-[10px] border border-[#e5e5e5] bg-white overflow-hidden max-h-[640px] overflow-y-auto">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={`skeleton-${idx}`}
              className="flex flex-col gap-1.5 border-b border-[#e5e5e5] p-3.5 last:border-b-0 animate-pulse"
            >
              <div className="h-4 w-28 rounded bg-slate-200" />
              <div className="h-3 w-16 rounded bg-slate-200" />
            </div>
          ))
        ) : stations.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <p className="text-sm font-medium text-slate-600">
              Chưa có trạm nào
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Thêm trạm trong tab Thông tin cơ bản
            </p>
          </div>
        ) : (
          // Stations flat list (Figma Node 1719:1460)
          stations.map((station) => {
            const stationType =
              station.stationType ||
              (station.isHidden ? 'Trạm ẩn' : 'Trạm thường')

            return (
              <div
                key={station.id}
                className="flex flex-col gap-1 border-b border-[#e5e5e5] px-4 py-3.5 last:border-b-0"
              >
                {/* Line 1: Station Name */}
                <span className="text-base font-normal leading-tight text-[#111827] break-words">
                  {station.name?.trim() || 'Trạm chưa đặt tên'}
                </span>

                {/* Line 2: Station Type */}
                <span className="text-[11px] font-normal leading-tight text-[#8a8a8a] break-words">
                  {stationType}
                </span>
              </div>
            )
          })
        )}
      </div>
    </aside>
  )
}
