import React from 'react'
import type { StationItem } from '../../model/buildMap.types'

export interface StationPaletteSidebarProps {
  stations: StationItem[]
  isLoading?: boolean
  isLocked?: boolean
  selectedStationId?: string | null
  onStationSelect?: (stationId: string) => void
  onStationRemovePin?: (stationId: string) => void
  onDragStart?: (station: StationItem, e: React.DragEvent) => void
  className?: string
}

/**
 * Left Column Sidebar: Station Palette displaying unplaced and placed stations.
 * Conforms to Figma Node 1719-1420 & Node 1744-1966.
 */
export const StationPaletteSidebar = ({
  stations = [],
  isLoading = false,
  isLocked = false,
  selectedStationId = null,
  onStationSelect,
  onStationRemovePin,
  onDragStart,
  className = '',
}: StationPaletteSidebarProps) => {
  const unplacedStations = stations.filter(
    (s) =>
      s.mapX === null ||
      s.mapY === null ||
      s.mapX === undefined ||
      s.mapY === undefined ||
      Number.isNaN(s.mapX) ||
      Number.isNaN(s.mapY),
  )

  const handleDragStart = (station: StationItem, e: React.DragEvent) => {
    if (isLocked) {
      e.preventDefault()
      return
    }
    e.dataTransfer.setData('text/plain', station.id)
    e.dataTransfer.setData('application/json', JSON.stringify(station))
    e.dataTransfer.effectAllowed = 'copyMove'
    onDragStart?.(station, e)
  }

  return (
    <aside
      className={`flex w-full lg:w-[360px] xl:w-[408px] shrink-0 flex-col gap-2.5 ${className}`}
      aria-label="Danh sách các trạm"
    >
      {/* Sidebar Header (Figma Node 1719:1421) */}
      <div className="flex items-center justify-between">
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

        {!isLoading && stations.length > 0 && (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            {unplacedStations.length > 0
              ? `${unplacedStations.length} chưa đặt`
              : 'Đã đặt hết'}
          </span>
        )}
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
            const isPlaced =
              station.mapX !== null &&
              station.mapY !== null &&
              station.mapX !== undefined &&
              station.mapY !== undefined &&
              typeof station.mapX === 'number' &&
              typeof station.mapY === 'number' &&
              !Number.isNaN(station.mapX) &&
              !Number.isNaN(station.mapY)

            const isSelected = selectedStationId === station.id
            const stationType =
              station.stationType ||
              (station.isHidden ? 'Trạm ẩn' : 'Trạm thường')

            return (
              <div
                key={station.id}
                draggable={!isLocked && !isPlaced}
                onDragStart={(e) => handleDragStart(station, e)}
                onClick={() => onStationSelect?.(station.id)}
                className={`group flex items-center justify-between border-b border-[#e5e5e5] px-4 py-3.5 last:border-b-0 transition-colors ${
                  isPlaced
                    ? 'bg-slate-50/70 opacity-80'
                    : isLocked
                    ? 'bg-white cursor-default'
                    : 'bg-white hover:bg-slate-50/80 cursor-grab active:cursor-grabbing'
                } ${
                  isSelected
                    ? 'ring-2 ring-inset ring-[#de3336]/30 bg-red-50/20'
                    : ''
                }`}
                data-testid={`sidebar-station-card-${station.id}`}
              >
                <div className="flex flex-1 flex-col gap-1 min-w-0 pr-2">
                  {/* Line 1: Station Name */}
                  <span className="text-base font-normal leading-tight text-[#111827] break-words">
                    {station.name?.trim() || 'Trạm chưa đặt tên'}
                  </span>

                  {/* Line 2: Station Type */}
                  <span className="text-[11px] font-normal leading-tight text-[#8a8a8a] break-words">
                    {stationType}
                  </span>
                </div>

                {/* Right Status / Indicator / Action */}
                <div className="flex items-center gap-2 shrink-0">
                  {isPlaced ? (
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Đã đặt
                      </span>
                      {!isLocked && onStationRemovePin && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onStationRemovePin(station.id)
                          }}
                          className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                          title="Gỡ vị trí khỏi bản đồ"
                          aria-label="Gỡ vị trí khỏi bản đồ"
                        >
                          <svg
                            className="size-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ) : !isLocked ? (
                    /* Grip handle icon for unplaced draggable items */
                    <svg
                      className="size-4 text-slate-300 opacity-60 group-hover:opacity-100 transition-opacity"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <circle cx="9" cy="6" r="1.5" />
                      <circle cx="15" cy="6" r="1.5" />
                      <circle cx="9" cy="12" r="1.5" />
                      <circle cx="15" cy="12" r="1.5" />
                      <circle cx="9" cy="18" r="1.5" />
                      <circle cx="15" cy="18" r="1.5" />
                    </svg>
                  ) : null}
                </div>
              </div>
            )
          })
        )}
      </div>
    </aside>
  )
}
