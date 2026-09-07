import React from 'react'
import { useControls } from 'react-zoom-pan-pinch'
import { Spinner } from '@/core/shared'

export interface CoordinateLockControlsProps {
  /** Current lock state of station coordinates */
  isLocked: boolean
  /** Callback triggered when user clicks the lock/unlock button */
  onToggleLock: () => void
  /** True while the PUT API mutation is in flight */
  isSaving?: boolean
  /** Disables the lock toggle (e.g. non-draft frozen mode) */
  disabled?: boolean
  /** Tooltip displayed when disabled */
  disabledTooltip?: string
  /** Optional fallback callback for reset (useful for isolated unit testing) */
  onReset?: () => void
  /** Optional fallback callback for zoom in */
  onZoomIn?: () => void
  /** Optional fallback callback for zoom out */
  onZoomOut?: () => void
  /** Optional class overrides */
  className?: string
}

/**
 * 4-Button Floating Controls component placed at the bottom right of the map canvas.
 * Controls: Reset Viewport, Zoom In, Zoom Out, and Lock/Unlock with frosted glass finish.
 * Designed to be rendered inside TransformWrapper.
 */
export const CoordinateLockControls: React.FC<CoordinateLockControlsProps> = ({
  isLocked,
  onToggleLock,
  isSaving = false,
  disabled = false,
  disabledTooltip = 'Trận đấu đang diễn ra. Vị trí trạm đã được khóa cố định.',
  onReset,
  onZoomIn,
  onZoomOut,
  className = '',
}) => {
  const { zoomIn, zoomOut, resetTransform } = useControls()

  const handleReset = () => {
    if (onReset) onReset()
    else resetTransform()
  }

  const handleZoomIn = () => {
    if (onZoomIn) onZoomIn()
    else zoomIn()
  }

  const handleZoomOut = () => {
    if (onZoomOut) onZoomOut()
    else zoomOut()
  }

  const baseButtonClass =
    'relative flex size-11 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-md border border-neutral-200/80 text-[#111827] hover:bg-white hover:border-neutral-300 hover:shadow-lg active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#de3336] focus-visible:ring-offset-2 cursor-pointer'

  const disabledButtonClass =
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-auto disabled:hover:bg-white/90 disabled:hover:border-neutral-200/80 disabled:hover:shadow-md disabled:active:scale-100'

  return (
    <div
      data-testid="coordinate-lock-controls"
      className={`absolute bottom-5 right-4 z-10 flex flex-col gap-2 ${className}`}
    >
      {/* 1. Reset Viewport */}
      <button
        type="button"
        data-testid="btn-reset-viewport"
        onClick={handleReset}
        className={baseButtonClass}
        aria-label="Đặt lại góc nhìn"
        title="Đặt lại góc nhìn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="7" />
          <line x1="12" y1="2" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="2" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="22" y2="12" />
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        </svg>
      </button>

      {/* 2. Zoom In (+) */}
      <button
        type="button"
        data-testid="btn-zoom-in"
        onClick={handleZoomIn}
        className={baseButtonClass}
        aria-label="Phóng to"
        title="Phóng to"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
          aria-hidden="true"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* 3. Zoom Out (-) */}
      <button
        type="button"
        data-testid="btn-zoom-out"
        onClick={handleZoomOut}
        className={baseButtonClass}
        aria-label="Thu nhỏ"
        title="Thu nhỏ"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
          aria-hidden="true"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* 4. Lock / Unlock */}
      <button
        type="button"
        data-testid="btn-toggle-lock"
        onClick={onToggleLock}
        disabled={disabled || isSaving}
        className={`${baseButtonClass} ${disabledButtonClass}`}
        aria-label={
          isSaving
            ? 'Đang lưu vị trí...'
            : isLocked
              ? 'Mở khóa vị trí trạm'
              : 'Khóa vị trí trạm'
        }
        title={
          disabled
            ? disabledTooltip
            : isSaving
              ? 'Đang lưu vị trí...'
              : isLocked
                ? 'Mở khóa vị trí trạm'
                : 'Khóa vị trí trạm'
        }
      >
        {isSaving ? (
          <Spinner size="sm" className="size-5 text-[#de3336]" />
        ) : isLocked ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5 text-[#111827]"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span
              data-testid="lock-indicator-locked"
              className="absolute top-1.5 right-1.5 size-2 rounded-full bg-emerald-500 shadow-xs"
            />
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5 text-[#de3336]"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 9.9-1" />
            </svg>
            <span
              data-testid="lock-indicator-unlocked"
              className="absolute top-1.5 right-1.5 size-2 rounded-full bg-amber-500 animate-pulse"
            />
          </>
        )}
      </button>
    </div>
  )
}
