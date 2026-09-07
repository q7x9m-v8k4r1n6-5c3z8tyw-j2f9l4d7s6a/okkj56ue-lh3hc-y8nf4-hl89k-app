import React, { useState } from 'react'
import type { RaceBoothItem } from '../model/buildMap.contract'
import { isDropOutsideCanvas } from '../model/calculatePinCoordinates'

export interface AdminStationPinProps {
  booth: RaceBoothItem
  isLocked?: boolean
  isFrozen?: boolean
  mapWrapperRef?: React.RefObject<HTMLElement | null>
  onUnplaceStation?: (boothId: string) => void
  onDragStartPin?: (e: React.DragEvent, booth: RaceBoothItem) => void
  onDragEndPin?: (e: React.DragEvent, booth: RaceBoothItem) => void
}

/**
 * Teardrop SVG Pin marker on Admin Map Canvas with a pill label showing station name below tip.
 * Supports direct dragging when unlocked (isLocked = false), with lift feedback and drop animations.
 */
export const AdminStationPin: React.FC<AdminStationPinProps> = ({
  booth,
  isLocked = true,
  isFrozen = false,
  mapWrapperRef,
  onUnplaceStation,
  onDragStartPin,
  onDragEndPin,
}) => {
  const [isDragging, setIsDragging] = useState(false)

  const isInteractive = !isLocked && !isFrozen

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isInteractive) {
      e.preventDefault()
      return
    }

    setIsDragging(true)
    const payload = JSON.stringify({
      boothId: booth.boothId,
      boothName: booth.boothName,
      source: 'canvas',
      originalMapX: booth.mapX,
      originalMapY: booth.mapY,
    })

    e.dataTransfer.setData('application/json', payload)
    e.dataTransfer.setData('text/plain', booth.boothId)
    e.dataTransfer.effectAllowed = 'move'

    onDragStartPin?.(e, booth)
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false)

    // Check if dragged outside map bounds to trigger return-to-sidebar
    if (mapWrapperRef?.current) {
      const rect = mapWrapperRef.current.getBoundingClientRect()
      if (isDropOutsideCanvas(e.clientX, e.clientY, rect)) {
        onUnplaceStation?.(booth.boothId)
      }
    }

    onDragEndPin?.(e, booth)
  }

  // Fallback to 0 if mapX/mapY are not defined
  const leftPercent = booth.mapX ?? 0
  const topPercent = booth.mapY ?? 0

  return (
    <div
      data-testid={`admin-station-pin-${booth.boothId}`}
      role="button"
      tabIndex={isInteractive ? 0 : -1}
      aria-label={`Trạm ${booth.boothName}`}
      draggable={isInteractive}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
      className={`absolute select-none pointer-events-auto ${
        isInteractive
          ? 'cursor-grab active:cursor-grabbing hover:scale-105'
          : 'cursor-default'
      } ${
        isDragging
          ? 'scale-110 shadow-2xl opacity-80 z-30'
          : 'z-20 transition-transform duration-150 ease-out'
      }`}
    >
      {/* Teardrop Pin Marker - tip touches coordinate (0, 0) */}
      <div className="flex -translate-x-1/2 -translate-y-full origin-bottom items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-8 text-[#de3336] drop-shadow-md"
          aria-hidden="true"
        >
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
            stroke="#FFFFFF"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Station Name Pill Badge directly below pin tip */}
      <div
        data-testid={`admin-station-pin-pill-${booth.boothId}`}
        className={`absolute top-1 left-0 -translate-x-1/2 flex items-center whitespace-nowrap rounded-full bg-black/80 px-2 py-0.5 text-[11px] font-medium text-white shadow-md ${
          isInteractive && onUnplaceStation ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <span>{booth.boothName}</span>
        {isInteractive && onUnplaceStation && (
          <button
            type="button"
            data-testid={`admin-station-pin-unplace-${booth.boothId}`}
            aria-label={`Gỡ trạm ${booth.boothName}`}
            onClick={(e) => {
              e.stopPropagation()
              onUnplaceStation(booth.boothId)
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
            }}
            className="ml-1 inline-flex size-3.5 items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
