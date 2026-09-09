import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { TEAM_RACE_TAB_PARAM } from '@/core/shared/utils'
import type { StationPin } from '../../model/teamMap.types'

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


export interface StationDetailSheetProps {
  pin: StationPin | null
  onClose: () => void
  onNavigateToScan?: () => void
  isHideBoothDescription?: boolean
  isDisabledBoothStatus?: boolean
}

export const StationDetailSheet = ({
  pin,
  onClose,
  onNavigateToScan,
  isHideBoothDescription = false,
  isDisabledBoothStatus = false,
}: StationDetailSheetProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activePin, setActivePin] = useState<StationPin | null>(pin)
  const currentPinId = pin ? pin.id : null
  const [prevPinId, setPrevPinId] = useState<string | null>(currentPinId)
  const [, setSearchParams] = useSearchParams()

  // Keep a local copy of the pin so it doesn't disappear immediately during unmount transition
  // Reset expansion state when a new pin is selected or when the sheet closes
  if (currentPinId !== prevPinId) {
    setPrevPinId(currentPinId)
    setIsExpanded(false)
    if (pin) {
      setActivePin(pin)
    }
  } else if (pin && pin !== activePin) {
    setActivePin(pin)
  }

  const isOpen = Boolean(pin)
  const displayPin = pin ?? activePin
  const isOccupied = displayPin?.status === 'occupied'
  const sanitizedDesc = getSanitizedDescription(displayPin?.description)
  const strippedText = sanitizedDesc.replace(/<[^>]*>/g, '').trim()
  const isLongDescription = strippedText.length > 100

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleScanClick = () => {
    if (!isDisabledBoothStatus && isOccupied) return

    onClose()
    if (onNavigateToScan) {
      onNavigateToScan()
      return
    }
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      next.set(TEAM_RACE_TAB_PARAM, 'scan')
      return next
    })
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`absolute inset-0 z-10 bg-black/30 transition-opacity duration-300 ease-out ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Bottom Sheet */}
      <div
        role="dialog"
        aria-modal={isOpen}
        aria-labelledby="station-detail-title"
        className={`absolute inset-x-0 bottom-0 z-20 flex flex-col rounded-t-3xl bg-white p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out ${
          isOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
        }`}
      >
        {displayPin && (
          <>
            <div className="mb-2 flex items-center justify-between shrink-0">
              <h3 id="station-detail-title" className="text-xl font-bold text-[#111111]">
                {displayPin.name?.trim() || 'Trạm thử thách'}
              </h3>
              <button 
                type="button"
                onClick={onClose}
                className="flex size-8 items-center justify-center rounded-full bg-[#f3f4f6] text-[#6b7280] transition-colors hover:bg-[#e5e7eb] shrink-0"
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>

            <p className="mb-3 text-sm text-[#6b7280] shrink-0">
              📍 Địa điểm: {displayPin.place?.trim() || 'Chưa cập nhật'}
            </p>
            
            {!isDisabledBoothStatus && (
              <div className="mb-4 flex flex-wrap items-center gap-2 shrink-0">
                <span
                  className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold text-white ${
                    isOccupied ? 'bg-[#de3336]' : 'bg-[#168944]'
                  }`}
                >
                  {isOccupied ? 'Đang có đội tham gia' : 'Trống / Sẵn sàng'}
                </span>
              </div>
            )}

            {!isHideBoothDescription && Boolean(sanitizedDesc) && (
              <>
                <div
                  className={`mb-6 overflow-hidden transition-all duration-300 ease-out ${
                    isExpanded ? 'max-h-[50vh] overflow-y-auto' : 'max-h-[4.5rem]'
                  }`}
                >
                  <div
                    className="text-sm leading-relaxed text-[#4b5563] break-words [&_p]:mb-1 [&_p:last-child]:mb-0 [&_b]:font-bold [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
                    dangerouslySetInnerHTML={{ __html: sanitizedDesc }}
                  />
                </div>

                {isLongDescription && (
                  <button
                    type="button"
                    className="mb-6 -mt-4 text-left text-sm font-medium text-[#de3336] underline underline-offset-4 decoration-[1px] [text-decoration-skip-ink:none] hover:text-[#b91c1c] transition-colors shrink-0"
                    onClick={() => setIsExpanded((prev) => !prev)}
                  >
                    {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                  </button>
                )}
              </>
            )}

            <button 
              type="button"
              onClick={handleScanClick}
              disabled={!isDisabledBoothStatus && isOccupied}
              className="mt-auto shrink-0 w-full rounded-xl bg-[#de3336] py-3.5 font-bold text-white transition-colors hover:bg-[#b91c1c] disabled:bg-[#9ca3af] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Chuyển sang Quét QR
            </button>
          </>
        )}
      </div>
    </>
  )
}
