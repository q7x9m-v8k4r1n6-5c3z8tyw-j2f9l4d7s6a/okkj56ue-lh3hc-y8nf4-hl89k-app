import type { StationPin } from '../../model/teamMap.types'

interface StationPinItemProps {
  pin: StationPin
  isSelected: boolean
  onClick: (id: string) => void
}

export const StationPinItem = ({ pin, isSelected, onClick }: StationPinItemProps) => {
  const getPinColorClass = () => {
    switch (pin.status) {
      case 'completed':
        return 'text-[#166534]'
      case 'occupied':
        return 'text-[#ea580c]'
      case 'pending':
        return 'text-[#d97706]'
      case 'active':
      case 'free':
        return 'text-[#de3336]'
      case 'locked':
      default:
        return 'text-[#9ca3af]'
    }
  }

  const colorClass = getPinColorClass()

  return (
    <button
      type="button"
      className={`absolute flex size-10 -translate-x-1/2 -translate-y-full origin-bottom items-center justify-center transition-all duration-300 cursor-pointer ${colorClass} ${
        isSelected
          ? 'scale-125 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10'
          : 'hover:scale-110 drop-shadow-md z-0'
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
          strokeWidth="1"
        />
      </svg>

      {pin.code ? (
        <span className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-white whitespace-nowrap shadow-xs">
          {pin.code}
        </span>
      ) : null}
    </button>
  )
}
