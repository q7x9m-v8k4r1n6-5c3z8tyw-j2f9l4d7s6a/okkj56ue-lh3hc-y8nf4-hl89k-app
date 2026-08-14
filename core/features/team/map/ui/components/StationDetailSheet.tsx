import { useState } from 'react'
import type { StationPin } from '../../model/teamMap.types'

interface StationDetailSheetProps {
  pin: StationPin | null
  onClose: () => void
}

export const StationDetailSheet = ({ pin, onClose }: StationDetailSheetProps) => {
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
  const buttonLabel = isCompleted ? 'Trạm đã hoàn thành' : 'Chuyển sang Quét QR'
  const isButtonDisabled = isCompleted || isLocked
  const isLongDescription = displayPin ? displayPin.description.length > 100 : false

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
                className="flex size-8 items-center justify-center rounded-full bg-[#f3f4f6] text-[#6b7280] transition-colors hover:bg-[#e5e7eb] shrink-0"
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4 flex flex-wrap items-center gap-2 shrink-0">
              <span className="rounded-md bg-[#f3f4f6] px-2.5 py-1 text-xs font-semibold text-[#4b5563]">
                Mã: {displayPin.code}
              </span>
              <span className={`rounded-md px-2.5 py-1 text-xs font-semibold text-white ${
                displayPin.status === 'completed' ? 'bg-[#166534]' :
                displayPin.status === 'active' ? 'bg-[#de3336]' : 
                'bg-[#9ca3af]'
              }`}>
                {displayPin.status === 'completed' ? 'Hoàn thành' : displayPin.status === 'active' ? 'Đang mở' : 'Đã khoá'}
              </span>
              <span className="rounded-md bg-[#fef3c7] px-2.5 py-1 text-xs font-semibold text-[#b45309]">
                {displayPin.points} điểm
              </span>
            </div>

            <div className={`mb-6 overflow-hidden transition-all duration-300 ease-out ${isExpanded ? 'max-h-[50vh] overflow-y-auto' : 'max-h-[4.5rem]'}`}>
              <p className="text-sm leading-relaxed text-[#4b5563]">
                {displayPin.description}
              </p>
            </div>

            {!isExpanded && isLongDescription && (
              <button
                type="button"
                className="mb-6 -mt-4 text-left text-sm font-medium text-[#de3336] underline underline-offset-4 decoration-[1px] [text-decoration-skip-ink:none] hover:text-[#b91c1c] transition-colors shrink-0"
                onClick={() => setIsExpanded(true)}
              >
                Xem thêm
              </button>
            )}

            <button 
              type="button"
              className="mt-auto shrink-0 w-full rounded-xl bg-[#de3336] py-3.5 font-bold text-white transition-colors hover:bg-[#b91c1c] disabled:bg-[#9ca3af] disabled:opacity-50"
              disabled={isButtonDisabled}
            >
              {buttonLabel}
            </button>
          </>
        )}
      </div>
    </>
  )
}
