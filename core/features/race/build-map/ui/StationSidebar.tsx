import React, { useRef, useState } from 'react'
import DOMPurify from 'dompurify'
import { FormatListBulletedIcon } from '@/core/assets/icons'
import { Button, Skeleton } from '@/core/shared'
import type { RaceBoothItem } from '../model/buildMap.contract'

/**
 * Safely sanitizes HTML description and handles empty/blank HTML values.
 */
const getSanitizedDescription = (description?: string | null): string => {
  if (!description) return ''
  const trimmed = description.trim()
  if (!trimmed) return ''

  const sanitized =
    typeof DOMPurify?.sanitize === 'function' ? DOMPurify.sanitize(trimmed) : trimmed

  const strippedText = sanitized
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()

  if (strippedText.length === 0) return ''
  return sanitized
}

export type StationSidebarProps = {
  booths: RaceBoothItem[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  placedBoothIds?: Set<string>
  isLocked?: boolean
  isFrozen?: boolean
  onUnplaceStation?: (boothId: string) => void
  defaultExpandedBoothIds?: Set<string>
}

/**
 * Helper to render Vietnamese status badge for a booth in the detail panel.
 */
const renderBoothStatusBadge = (booth: RaceBoothItem) => {
  const statusKey = (booth.status || '').trim().toLowerCase()

  if (statusKey === 'free') {
    return (
      <div
        data-testid={`booth-status-${booth.boothId}`}
        className="flex items-center gap-1.5 pt-0.5"
      >
        <span className="text-neutral-500 font-medium">Trạng thái:</span>
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
          Trống
        </span>
      </div>
    )
  }

  if (statusKey === 'occupied') {
    return (
      <div
        data-testid={`booth-status-${booth.boothId}`}
        className="flex items-center gap-1.5 pt-0.5"
      >
        <span className="text-neutral-500 font-medium">Trạng thái:</span>
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
          {booth.currentTeamName
            ? `Đang phục vụ (${booth.currentTeamName})`
            : 'Đang phục vụ'}
        </span>
      </div>
    )
  }

  if (statusKey === 'pending') {
    return (
      <div
        data-testid={`booth-status-${booth.boothId}`}
        className="flex items-center gap-1.5 pt-0.5"
      >
        <span className="text-neutral-500 font-medium">Trạng thái:</span>
        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
          Chờ duyệt
        </span>
      </div>
    )
  }

  if (booth.status) {
    return (
      <div
        data-testid={`booth-status-${booth.boothId}`}
        className="flex items-center gap-1.5 pt-0.5"
      >
        <span className="text-neutral-500 font-medium">Trạng thái:</span>
        <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
          {booth.status}
        </span>
      </div>
    )
  }

  return null
}

/**
 * Left sidebar displaying the list of race stations/booths according to Figma node 1719:1420.
 * Supports HTML5 Drag and Drop with Teardrop SVG ghost preview,
 * placed station indicators with duplicate prevention,
 * accordion dropdown for viewing station details,
 * and a return-to-sidebar dropzone to unplace pins.
 */
export const StationSidebar = ({
  booths,
  isLoading = false,
  isError = false,
  onRetry,
  placedBoothIds = new Set(),
  isLocked = true,
  isFrozen = false,
  onUnplaceStation,
  defaultExpandedBoothIds,
}: StationSidebarProps) => {
  const dragGhostRef = useRef<HTMLDivElement>(null)
  const hiddenDragGhostRef = useRef<HTMLDivElement>(null)
  const [isDragOverReturn, setIsDragOverReturn] = useState(false)
  const [expandedBoothIds, setExpandedBoothIds] = useState<Set<string>>(
    () => new Set(defaultExpandedBoothIds),
  )

  const toggleExpandBooth = (boothId: string) => {
    setExpandedBoothIds((prev) => {
      const next = new Set(prev)
      if (next.has(boothId)) {
        next.delete(boothId)
      } else {
        next.add(boothId)
      }
      return next
    })
  }

  const canDrag = !isLocked && !isFrozen

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, booth: RaceBoothItem) => {
    if (!canDrag || placedBoothIds.has(booth.boothId)) {
      e.preventDefault()
      return
    }

    const payload = JSON.stringify({
      boothId: booth.boothId,
      boothName: booth.boothName,
      source: 'sidebar',
    })

    e.dataTransfer.setData('application/json', payload)
    e.dataTransfer.setData('text/plain', booth.boothId)
    e.dataTransfer.effectAllowed = 'copyMove'

    const targetGhost = booth.isHidden
      ? hiddenDragGhostRef.current
      : dragGhostRef.current

    if (targetGhost && e.dataTransfer?.setDragImage) {
      // Center x is 16px (half of 32px), bottom tip y is 32px
      e.dataTransfer.setDragImage(targetGhost, 16, 32)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    // Only accept drops if not locked/frozen
    if (!canDrag) return

    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (!isDragOverReturn) {
      setIsDragOverReturn(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Check if moving out of sidebar container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOverReturn(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOverReturn(false)

    if (!canDrag) return

    try {
      const rawJson = e.dataTransfer.getData('application/json')
      const plainText = e.dataTransfer.getData('text/plain')

      let boothId = plainText
      if (rawJson) {
        try {
          const parsed = JSON.parse(rawJson) as { boothId?: string }
          if (parsed && typeof parsed.boothId === 'string') {
            boothId = parsed.boothId
          }
        } catch {
          // Ignore JSON parse error, fall back to plainText
        }
      }

      if (boothId && placedBoothIds.has(boothId)) {
        onUnplaceStation?.(boothId)
      }
    } catch {
      // Ignore drop parsing errors
    }
  }

  return (
    <div
      data-testid="station-sidebar"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex h-auto lg:h-full w-full flex-col gap-2.5 shrink-0 lg:w-[408px] transition-colors rounded-[10px] ${
        isDragOverReturn ? 'ring-2 ring-dashed ring-[#de3336] bg-red-50/20' : ''
      }`}
    >
      {/* Offscreen Drag Ghost Preview (Teardrop SVG Pin) */}
      <div
        ref={dragGhostRef}
        style={{ position: 'fixed', top: -9999, left: -9999, pointerEvents: 'none' }}
        className="flex flex-col items-center z-[-1]"
        aria-hidden="true"
        data-testid="station-drag-ghost"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-8 text-[#de3336] drop-shadow-lg"
        >
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
            stroke="#FFFFFF"
            strokeWidth="1"
          />
        </svg>
        <div className="mt-0.5 rounded-full bg-black/80 px-2 py-0.5 text-[10px] font-medium text-white shadow whitespace-nowrap">
          Trạm
        </div>
      </div>

      {/* Offscreen Drag Ghost Preview for Hidden Station (Gray Teardrop SVG Pin) */}
      <div
        ref={hiddenDragGhostRef}
        style={{ position: 'fixed', top: -9999, left: -9999, pointerEvents: 'none' }}
        className="flex flex-col items-center z-[-1]"
        aria-hidden="true"
        data-testid="station-drag-ghost-hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-8 text-neutral-500 drop-shadow-lg"
        >
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
            stroke="#FFFFFF"
            strokeWidth="1"
            strokeDasharray="2 1"
          />
        </svg>
        <div className="mt-0.5 rounded-full bg-neutral-800/90 px-2 py-0.5 text-[10px] font-medium text-white shadow whitespace-nowrap">
          Trạm ẩn
        </div>
      </div>

      {/* Header matching Figma node 1719:1421 */}
      <div className="flex items-center justify-between shrink-0 py-0.5">
        <div className="flex items-center gap-2.5">
          <FormatListBulletedIcon className="size-6 text-[#040000] shrink-0" />
          <h3 className="text-base font-semibold leading-7 text-[#040000]">
            Danh sách các trạm
          </h3>
        </div>
        {booths.length > 0 && (
          <span className="text-xs font-medium text-[#5e5e5e]" data-testid="placed-booths-counter">
            {placedBoothIds.size}/{booths.length} đã đặt
          </span>
        )}
      </div>

      {/* Return Dropzone indicator overlay when dragging over sidebar */}
      {isDragOverReturn && (
        <div
          data-testid="sidebar-return-dropzone"
          className="rounded-[8px] bg-red-50 border border-dashed border-[#de3336] p-2 text-center text-xs font-medium text-[#de3336] animate-pulse"
        >
          Thả trạm vào đây để gỡ khỏi bản đồ
        </div>
      )}

      {/* Main station list container matching Figma node 1719:1425 */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="flex flex-1 flex-col overflow-hidden rounded-[10px] border border-[#e5e5e5] bg-white min-h-[380px]"
      >
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
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="flex-1 overflow-y-auto px-4.5 py-1 divide-y divide-[#dcc0bd]/30"
          >
            {booths.map((booth) => {
              const isPlaced = placedBoothIds.has(booth.boothId)
              const cardDraggable = canDrag && !isPlaced
              const isExpanded = expandedBoothIds.has(booth.boothId)
              const sanitizedDesc = getSanitizedDescription(booth.description)

              return (
                <div
                  key={booth.boothId}
                  data-testid={`booth-card-${booth.boothId}`}
                  draggable={cardDraggable}
                  onDragStart={(e) => handleDragStart(e, booth)}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`flex flex-col gap-1.5 py-3.5 rounded transition-all select-none ${
                    isPlaced
                      ? 'opacity-60 bg-neutral-50/60 cursor-not-allowed'
                      : cardDraggable
                        ? 'cursor-grab active:cursor-grabbing hover:bg-[#fafafa]'
                        : 'cursor-default hover:bg-[#fafafa]'
                  }`}
                >
                  <div className="text-base font-normal text-[#1a1c1c] leading-snug break-words">
                    {booth.boothName}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isPlaced ? (
                        <span
                          data-testid={`booth-placed-badge-${booth.boothId}`}
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
                        >
                          ✓ Đã đặt trên bản đồ
                        </span>
                      ) : (
                        <span
                          className={
                            booth.isHidden
                              ? 'inline-flex items-center rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200 px-2 py-0.5 text-[11px] font-medium'
                              : 'inline-flex items-center rounded-full bg-[#f5f5f5] px-2 py-0.5 text-[11px] font-medium text-[#5e5e5e]'
                          }
                        >
                          {booth.isHidden ? 'Trạm ẩn' : 'Trạm thường'}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      data-testid={`booth-expand-btn-${booth.boothId}`}
                      aria-expanded={isExpanded}
                      aria-label={`Chi tiết trạm ${booth.boothName}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleExpandBooth(booth.boothId)
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="p-1 text-[#5e5e5e] hover:text-[#1a1c1c] hover:bg-neutral-100 rounded transition-colors cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`size-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                  </div>

                  {/* Collapsible Detail Panel */}
                  {isExpanded && (
                    <div
                      data-testid={`booth-detail-panel-${booth.boothId}`}
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onDragStart={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      className="bg-neutral-50 rounded-lg border border-neutral-200/80 p-2.5 mt-2 text-xs flex flex-col gap-1.5 cursor-auto select-text"
                    >
                      {/* Mô tả trạm */}
                      {sanitizedDesc ? (
                        <div
                          data-testid={`booth-description-${booth.boothId}`}
                          className="text-neutral-600 break-words leading-relaxed [&_p]:mb-1 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mb-0.5"
                          dangerouslySetInnerHTML={{ __html: sanitizedDesc }}
                        />
                      ) : (
                        <p
                          data-testid={`booth-description-${booth.boothId}`}
                          className="text-neutral-600 break-words leading-relaxed"
                        >
                          Chưa có mô tả.
                        </p>
                      )}
                      {Boolean(booth.boothLocation) && (
                        <div
                          data-testid={`booth-location-${booth.boothId}`}
                          className="flex items-center gap-1.5 text-neutral-700 font-medium"
                        >
                          <span>📍 Vị trí: {booth.boothLocation}</span>
                        </div>
                      )}
                      {renderBoothStatusBadge(booth)}
                      {Boolean(booth.currentOrganizerName) && (
                        <div
                          data-testid={`booth-organizer-${booth.boothId}`}
                          className="flex items-center gap-1.5 text-neutral-700"
                        >
                          <span>👤 Người phụ trách: {booth.currentOrganizerName}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
