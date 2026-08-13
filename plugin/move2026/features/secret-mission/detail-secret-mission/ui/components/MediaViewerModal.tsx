import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from '@/core/assets'

export type MediaViewerModalProps = {
  url: string
  isVideo: boolean
  onClose: () => void
}

export const MediaViewerModal = ({ url, isVideo, onClose }: MediaViewerModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 active:scale-95"
      >
        <CloseIcon className="size-5" />
      </button>

      {isVideo ? (
        <video
          src={url}
          controls
          autoPlay
          playsInline
          className="max-h-full max-w-full object-contain"
        />
      ) : (
        <img
          src={url}
          alt="Phóng to minh chứng"
          className="max-h-full max-w-full object-contain"
        />
      )}
    </div>,
    document.body
  )
}