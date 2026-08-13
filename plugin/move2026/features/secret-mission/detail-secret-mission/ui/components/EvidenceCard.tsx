import { CloseIcon, PlayCircleIcon } from '@/core/assets'
import { formatGmt7Time } from '@/core/shared/utils'

export type EvidenceCardProps = {
  id: string
  url: string
  createdAt: string
  isVideo: boolean
  isEditMode: boolean
  onDeleteClick: (id: string) => void
  onViewClick: () => void
}

export const EvidenceCard = ({
  id,
  url,
  createdAt,
  isVideo,
  isEditMode,
  onDeleteClick,
  onViewClick,
}: EvidenceCardProps) => {
  return (
    <div className="relative flex aspect-[9/16] w-full flex-col overflow-hidden rounded-xl border border-[#eeeeee] bg-white shadow-sm">
      {/* Nút Xóa */}
      {isEditMode ? (
        <button
          type="button"
          onClick={() => onDeleteClick(id)}
          className="absolute right-1.5 top-1.5 z-10 flex size-6 items-center justify-center rounded-full bg-black/60 text-white transition-transform hover:scale-110 active:scale-95"
        >
          <CloseIcon className="size-3.5" />
        </button>
      ) : null}

      <div 
        className="relative flex-1 min-h-0 overflow-hidden cursor-pointer bg-[#166534] transition-opacity hover:opacity-90"
        onClick={onViewClick}
      >
        {isVideo ? (
          <>
            <video
              src={`${url}#t=0.1`}
              className="h-full w-full object-cover"
              preload="metadata"
              muted
              playsInline
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            <div className="absolute inset-0 grid place-items-center bg-black/20">
              <PlayCircleIcon className="size-8 text-red-500" />
            </div>
          </>
        ) : (
          <img 
            src={url} 
            alt="Minh chứng" 
            className="h-full w-full object-cover" 
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        )}
      </div>

      <div className="flex h-8 shrink-0 items-center justify-center bg-white px-1">
        <span className="truncate text-[9px] text-[#5e5e5e]">
          Cập nhật lần cuối: {formatGmt7Time(createdAt)}
        </span>
      </div>
    </div>
  )
}