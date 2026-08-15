import React, { useState } from 'react'
import { getStationInitial } from '../../model/frontend/usePinPlacementState'

export interface AdminStationPinProps {
  id: string
  name: string
  stationType?: string
  status?: 'free' | 'pending' | 'occupied' | 'completed' | 'locked' | string
  isHidden?: boolean
  x: number // Relative percentage [0.00, 100.00]
  y: number // Relative percentage [0.00, 100.00]
  isSelected?: boolean
  isLocked?: boolean
  isDragging?: boolean
  onClick?: (id: string, e: React.MouseEvent) => void
  onRemove?: (id: string) => void
  onDragStart?: (id: string, e: React.DragEvent) => void
  className?: string
}

/**
 * Teardrop SVG Station Pin marker for Admin Map Canvas (Figma Node 1744-1966).
 * Anchored at bottom-center tip via `origin-bottom -translate-x-1/2 -translate-y-full`.
 */
export const AdminStationPin = ({
  id,
  name,
  stationType,
  status = 'free',
  isHidden = false,
  x,
  y,
  isSelected = false,
  isLocked = false,
  isDragging = false,
  onClick,
  onRemove,
  onDragStart,
  className = '',
}: AdminStationPinProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const initial = getStationInitial(name)

  // Status color mapping
  const pinColor = isHidden
    ? '#7c3aed' // Purple for hidden booths
    : status === 'completed'
    ? '#166534' // Forest green
    : status === 'pending'
    ? '#eab308' // Amber
    : status === 'locked'
    ? '#9ca3af' // Slate gray
    : '#de3336' // Brand red default

  const handleDragStart = (e: React.DragEvent) => {
    if (isLocked) {
      e.preventDefault()
      return
    }
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ id, name, isPlaced: true, mapX: x, mapY: y }),
    )
    e.dataTransfer.effectAllowed = 'move'
    onDragStart?.(id, e)
  }

  return (
    <div
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -100%)',
      }}
      className={`absolute origin-bottom select-none transition-all duration-150 ease-out ${
        isLocked ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
      } ${
        isDragging
          ? 'opacity-80 scale-125 z-40 pointer-events-none'
          : isSelected
          ? 'scale-125 z-30 drop-shadow-[0_0_12px_rgba(222,51,54,0.65)] ring-2 ring-blue-500 ring-offset-2 rounded-full'
          : 'hover:scale-110 hover:drop-shadow-lg z-10'
      } ${className}`}
      draggable={!isLocked}
      onDragStart={handleDragStart}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(id, e)
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`admin-station-pin-${id}`}
      aria-label={`Trạm ${name || 'chưa đặt tên'}`}
    >
      {/* Floating Tooltip Label on Hover / Selected */}
      {(isHovered || isSelected) && (
        <div className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full z-50 flex flex-col items-center">
          <div className="flex items-center gap-1.5 whitespace-nowrap rounded-md bg-slate-900/90 px-2.5 py-1 text-xs font-medium text-white shadow-md backdrop-blur-xs">
            <span className="truncate max-w-[150px]">{name || 'Trạm chưa đặt tên'}</span>
            {stationType && !isHidden && (
              <span className="text-[10px] text-slate-300">({stationType})</span>
            )}
            {isHidden && (
              <span className="rounded bg-purple-500/40 px-1 py-0.5 text-[10px] text-purple-200">
                Ẩn
              </span>
            )}
            {!isLocked && onRemove && isSelected && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(id)
                }}
                className="ml-1 rounded p-0.5 text-red-300 hover:bg-white/20 hover:text-white pointer-events-auto transition-colors cursor-pointer"
                title="Gỡ khỏi bản đồ"
                aria-label="Gỡ vị trí"
              >
                <svg
                  className="size-3"
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
          {/* Tooltip Arrow */}
          <div className="h-1.5 w-2 border-x-4 border-t-4 border-x-transparent border-t-slate-900/90" />
        </div>
      )}

      {/* Teardrop SVG Pin Body */}
      <div className="relative flex size-10 items-center justify-center">
        <svg
          viewBox="0 0 36 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-full overflow-visible drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)]"
        >
          {/* Outer Teardrop Pin */}
          <path
            d="M18 2C9.163 2 2 9.163 2 18C2 28.5 16.2 42.1 16.8 42.7C17.4 43.3 18.6 43.3 19.2 42.7C19.8 42.1 34 28.5 34 18C34 9.163 26.837 2 18 2Z"
            fill={pinColor}
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Inner Badge Circle Container */}
          <circle cx="18" cy="18" r="9.5" fill="#FFFFFF" fillOpacity="0.22" />
        </svg>

        {/* Center Station Initial / Code */}
        <span className="absolute top-[7px] left-1/2 -translate-x-1/2 text-center text-xs font-bold text-white leading-none select-none tracking-tight">
          {initial}
        </span>
      </div>
    </div>
  )
}
