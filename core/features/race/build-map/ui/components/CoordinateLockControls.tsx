import { LockIcon } from '@/core/assets/icons'
import { Spinner } from '@/core/shared'

export interface CoordinateLockControlsProps {
  isLocked: boolean
  isDraft: boolean
  isSaving?: boolean
  onToggleLock?: () => void
  className?: string
}

/**
 * Floating Lock/Unlock controls rendered at bottom right of Admin Map Canvas.
 * Conforms to Figma Node 1744-1966 & Requirement R2.
 */
export const CoordinateLockControls = ({
  isLocked,
  isDraft,
  isSaving = false,
  onToggleLock,
  className = '',
}: CoordinateLockControlsProps) => {
  const isDisabled = !isDraft || isSaving

  return (
    <div className={`absolute bottom-4 right-4 z-20 ${className}`}>
      <button
        type="button"
        disabled={isDisabled}
        onClick={onToggleLock}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-lg backdrop-blur-md transition-all duration-150 ${
          isDisabled
            ? 'bg-slate-200/80 text-slate-400 cursor-not-allowed border border-slate-300 shadow-none opacity-60'
            : isLocked
            ? 'bg-white/95 text-slate-800 border border-slate-200 hover:bg-slate-50 hover:shadow-xl cursor-pointer'
            : 'bg-[#de3336] text-white hover:bg-[#c82528] active:bg-[#b01e21] cursor-pointer'
        }`}
        title={
          !isDraft
            ? 'Trận đấu đang diễn ra. Vị trí trạm đã được khóa cố định.'
            : isLocked
            ? 'Mở khóa để điều chỉnh vị trí các trạm'
            : 'Khóa và lưu vị trí các trạm lên hệ thống'
        }
        data-testid="coordinate-lock-btn"
      >
        {isSaving ? (
          <>
            <Spinner size="sm" className={isLocked ? 'text-slate-700' : 'text-white'} />
            <span>Đang lưu...</span>
          </>
        ) : isLocked ? (
          <>
            <LockIcon className="size-3.5 text-slate-700" />
            <span>Mở khóa vị trí</span>
          </>
        ) : (
          <>
            <LockIcon className="size-3.5 text-white" />
            <span>Khóa vị trí</span>
          </>
        )}
      </button>
    </div>
  )
}
