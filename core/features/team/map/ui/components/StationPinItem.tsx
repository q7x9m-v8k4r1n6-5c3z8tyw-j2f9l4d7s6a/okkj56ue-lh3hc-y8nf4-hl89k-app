import type { StationPin } from '../../model/teamMap.types'
import { StationPinBubble } from './StationPinBubble'

interface StationPinItemProps {
  pin: StationPin
  isSelected: boolean
  onClick: (id: string) => void
}

/**
 * Interactive station map pin on player view.
 * Renders a teardrop SVG pin with glow effect and floating detail bubble.
 * Restored to commit 9c95f67 flat-button structure with 2-color status scheme.
 */
export const StationPinItem = ({ pin, isSelected, onClick }: StationPinItemProps) => {
  const isOccupied =
    pin.status === 'occupied' ||
    pin.status === 'completed' ||
    Boolean(pin.currentTeamName)

  return (
    <button
      type="button"
      className={`absolute flex size-10 -translate-x-1/2 -translate-y-full origin-bottom items-center justify-center transition-all duration-300 ${
        isOccupied ? 'text-[#de3336]' : 'text-[#16a34a]'
      } ${
        isSelected
          ? 'scale-125 drop-shadow-[0_0_10px_rgba(255,255,255,0.95)] z-30'
          : 'hover:scale-115 drop-shadow-md z-10'
      }`}
      style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
      onClick={(e) => {
        e.stopPropagation()
        onClick(pin.id)
      }}
      aria-label={`Trạm ${pin.name}`}
      data-testid={`station-pin-${pin.id}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-10 drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
      >
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
          stroke="white"
          strokeWidth="0.8"
        />
      </svg>

      {/* Floating Bubble card positioned above the pin */}
      {isSelected && <StationPinBubble pin={pin} />}
    </button>
  )
}
