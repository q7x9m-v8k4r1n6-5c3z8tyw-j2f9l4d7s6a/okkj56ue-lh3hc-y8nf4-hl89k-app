import type { StationPin } from '../../model/teamMap.types'

interface StationPinBubbleProps {
  pin: StationPin
}

/**
 * Floating Bubble Card displayed directly above a selected station pin.
 * Uses pure CSS @keyframes for a spring-pop entrance animation.
 * Strictly presents 2 rows: Station Name and Status Badge (Trống / Bận).
 */
export const StationPinBubble = ({ pin }: StationPinBubbleProps) => {
  const isOccupied =
    pin.status === 'occupied' ||
    pin.status === 'completed' ||
    Boolean(pin.currentTeamName)

  const isFree = !isOccupied

  return (
    <>
      {/* Inject CSS keyframe animation – rendered once per bubble instance */}
      <style>{`
        @keyframes bubbleSpringPop {
          0% {
            opacity: 0;
            transform: translate(-50%, -100%) translateY(10px) scale(0.7);
          }
          70% {
            opacity: 1;
            transform: translate(-50%, -100%) translateY(-2px) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -100%) translateY(0) scale(1);
          }
        }
      `}</style>

      <div
        role="tooltip"
        aria-label={`Chi tiết ${pin.name}`}
        className="absolute -top-3 left-1/2 z-50 flex min-w-[130px] max-w-[180px] flex-col items-center gap-1.5 rounded-2xl border border-[#e5e5e5] bg-white px-4 py-2.5 text-center shadow-[0_12px_32px_rgba(0,0,0,0.18)]"
        style={{
          animation:
            'bubbleSpringPop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Row 1: Station Name */}
        <span
          className="max-w-[150px] truncate text-[13px] font-bold text-[#111827]"
          title={pin.name}
        >
          {pin.name}
        </span>

        {/* Row 2: Status Badge (Trống / Bận) */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
            isFree
              ? 'border-[#bbf7d0] bg-[#f0fdf4] text-[#16a34a]'
              : 'border-[#fecaca] bg-[#fef2f2] text-[#de3336]'
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${isFree ? 'bg-[#16a34a]' : 'bg-[#de3336]'}`}
          />
          {isFree ? 'Trống' : 'Bận'}
        </span>

        {/* Caret Arrow pointing down to the pin tip */}
        <div
          className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-b border-r border-[#e5e5e5] bg-white"
          aria-hidden="true"
        />
      </div>
    </>
  )
}
