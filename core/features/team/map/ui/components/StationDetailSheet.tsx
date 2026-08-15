import { useState } from 'react'
import type { StationPin } from '../../model/teamMap.types'

interface StationDetailSheetProps {
  pin: StationPin | null
  onClose: () => void
  onNavigateToQr?: () => void
}

export const StationDetailSheet = ({ pin, onClose, onNavigateToQr }: StationDetailSheetProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activePin, setActivePin] = useState<StationPin | null>(pin)

  // Keep a local copy of the pin so it doesn't disappear immediately during unmount transition
  // Reset expansion state when a new pin is selected
  if (pin && pin.id !== activePin?.id) {
    setActivePin(pin)
    setIsExpanded(false)
  }

  const isOpen = !!pin
  const displayPin = pin || activePin

  // Calculate states carefully to avoid runtime errors when displayPin is null
  const isCompleted = displayPin?.status === 'completed'
  const isLocked = displayPin?.status === 'locked'
  const isOccupied = displayPin?.status === 'occupied'

  const getButtonLabel = () => {
    if (isCompleted) return 'Trạm đã hoàn thành'
    if (isLocked) return 'Trạm đang khoá'
    if (isOccupied) return 'Trạm đang có đội tham gia'
    return 'Chuyển sang Quét QR'
  }

  const isButtonDisabled = isCompleted || isLocked
  const isLongDescription = displayPin ? displayPin.description.length > 100 : false

  const handleNavigateToQr = () => {
    if (isButtonDisabled) return
    onClose()
    if (onNavigateToQr) {
      onNavigateToQr()
      return
    }
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('tab', 'scan')
      window.history.pushState({}, '', url.toString())
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Hoàn thành', bg: 'bg-[#166534]' }
      case 'occupied':
        return { label: 'Đang có đội', bg: 'bg-[#ea580c]' }
      case 'pending':
        return { label: 'Đang chờ', bg: 'bg-[#d97706]' }
      case 'active':
      case 'free':
        return { label: 'Đang mở', bg: 'bg-[#de3336]' }
      case 'locked':
      default:
        return { label: 'Đã khoá', bg: 'bg-[#9ca3af]' }
    }
  }

  const statusBadge = getStatusBadge(displayPin?.status)

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`absolute inset-0 z-10 bg-black/30 transition-opacity duration-300 ease-out ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Bottom Sheet */}
      <div className={`absolute inset-x-0 bottom-0 z-20 flex flex-col rounded-t-3xl bg-white p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out ${isOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'}`}>
        {displayPin && (
          <>
            <div className="mb-4 flex items-center justify-between shrink-0">
              <h3 className="text-xl font-bold text-[#111111]">{displayPin.name}</h3>
              <button 
                type="button"
                onClick={onClose}
                className="flex size-8 items-center justify-center rounded-full bg-[#f3f4f6] text-[#6b7280] transition-colors hover:bg-[#e5e7eb] shrink-0 cursor-pointer"
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4 flex flex-wrap items-center gap-2 shrink-0">
              {displayPin.code ? (
                <span className="rounded-md bg-[#f3f4f6] px-2.5 py-1 text-xs font-semibold text-[#4b5563]">
                  Mã: {displayPin.code}
                </span>
              ) : null}
              <span className={`rounded-md px-2.5 py-1 text-xs font-semibold text-white ${statusBadge.bg}`}>
                {statusBadge.label}
              </span>
              <span className="rounded-md bg-[#fef3c7] px-2.5 py-1 text-xs font-semibold text-[#b45309]">
                {displayPin.points} điểm
              </span>
              {displayPin.currentTeamName ? (
                <span className="rounded-md bg-[#eff6ff] px-2.5 py-1 text-xs font-semibold text-[#1d4ed8]">
                  Đội: {displayPin.currentTeamName}
                </span>
              ) : null}
            </div>

            <div className={`mb-6 overflow-hidden transition-all duration-300 ease-out ${isExpanded ? 'max-h-[50vh] overflow-y-auto' : 'max-h-[4.5rem]'}`}>
              <p className="text-sm leading-relaxed text-[#4b5563]">
                {displayPin.description || 'Chưa có mô tả chi tiết cho trạm này.'}
              </p>
            </div>

            {!isExpanded && isLongDescription && (
              <button
                type="button"
                className="mb-6 -mt-4 text-left text-sm font-medium text-[#de3336] underline underline-offset-4 decoration-[1px] [text-decoration-skip-ink:none] hover:text-[#b91c1c] transition-colors shrink-0 cursor-pointer"
                onClick={() => setIsExpanded(true)}
              >
                Xem thêm
              </button>
            )}

            <button 
              type="button"
              className="mt-auto shrink-0 w-full rounded-xl bg-[#de3336] py-3.5 font-bold text-white transition-colors hover:bg-[#b91c1c] disabled:bg-[#9ca3af] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              disabled={isButtonDisabled}
              onClick={handleNavigateToQr}
            >
              {getButtonLabel()}
            </button>
          </>
        )}
      </div>
    </>
  )
}
