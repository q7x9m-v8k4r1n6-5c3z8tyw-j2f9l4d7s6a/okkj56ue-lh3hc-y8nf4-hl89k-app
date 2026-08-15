import { type DragEvent, type ChangeEvent, useRef, useState } from 'react'

export interface MapUploadDropzoneProps {
  onFileSelect: (file: File) => void
  error?: string | null
  onClearError?: () => void
  disabled?: boolean
}

/**
 * Dropzone component conforming to Figma Node 1719-1328 (Node 1745:276).
 * Renders a clean white card with rounded-[16px], border border-[#e5e5e5],
 * and centered '+' icon with 'Thêm ảnh bản đồ' label.
 */
export const MapUploadDropzone = ({
  onFileSelect,
  error,
  onClearError,
  disabled,
}: MapUploadDropzoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (!disabled && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      onFileSelect(droppedFile)
      e.dataTransfer.clearData()
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!disabled && e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      onFileSelect(selectedFile)
    }
  }

  const handleContainerClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-3">
      {error && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 shrink-0 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
          {onClearError && (
            <button
              type="button"
              onClick={onClearError}
              className="font-medium text-red-600 hover:text-red-800"
            >
              Đóng
            </button>
          )}
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleContainerClick}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-label="Thêm ảnh bản đồ"
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            handleContainerClick()
          }
        }}
        className={`flex min-h-[500px] flex-1 cursor-pointer flex-col items-center justify-center rounded-[16px] border border-[#e5e5e5] bg-white p-8 text-center transition-colors focus:outline-none focus:ring-1 focus:ring-slate-300 ${
          isDragOver ? 'bg-slate-50 border-slate-400' : 'hover:bg-slate-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onClick={(e) => {
            e.stopPropagation()
            e.currentTarget.value = ''
          }}
          onChange={(e) => {
            handleFileChange(e)
            e.target.value = ''
          }}
          className="hidden"
          data-testid="map-file-input"
        />

        <div className="flex flex-col items-center justify-center gap-2 select-none">
          {/* Plus icon '+' (Figma Node 1745:278) */}
          <svg
            className="h-6 w-6 text-[#1a1c1c]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>

          {/* Text 'Thêm ảnh bản đồ' (Figma Node 1745:281) */}
          <span className="text-[15.5px] font-light tracking-[0.6px] text-[#525252]">
            Thêm ảnh bản đồ
          </span>
        </div>
      </div>
    </div>
  )
}
