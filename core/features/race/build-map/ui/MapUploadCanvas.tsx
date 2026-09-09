import { useRef, useState, useEffect, type DragEvent, type ChangeEvent } from 'react'
import { UploadIcon } from '@/core/assets/icons'
import { Button, Spinner } from '@/core/shared'
import { validateDroppedFiles } from '../model/buildMap.validation'

export type MapUploadCanvasProps = {
  mapImageUrl?: string | null
  isUploading: boolean
  onUpload: (file: File) => void
  onError?: (message: string) => void
  className?: string
}

/**
 * Upload canvas component according to Figma node 1719:1506.
 * Supports Drag & Drop, file picker, loading indicator, image preview, and error states.
 */
export const MapUploadCanvas = ({
  mapImageUrl,
  isUploading,
  onUpload,
  onError,
  className = '',
}: MapUploadCanvasProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounterRef = useRef(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null)

  const isImageError = Boolean(mapImageUrl && failedImageUrl === mapImageUrl)

  // Clear stuck drag overlay on window blur or cancel
  useEffect(() => {
    const handleWindowDragEnd = () => {
      dragCounterRef.current = 0
      setIsDragOver(false)
    }
    window.addEventListener('dragend', handleWindowDragEnd)
    window.addEventListener('blur', handleWindowDragEnd)
    return () => {
      window.removeEventListener('dragend', handleWindowDragEnd)
      window.removeEventListener('blur', handleWindowDragEnd)
    }
  }, [])

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isUploading) {
      dragCounterRef.current += 1
      if (dragCounterRef.current === 1) {
        setIsDragOver(true)
      }
    }
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current = Math.max(0, dragCounterRef.current - 1)
    if (dragCounterRef.current === 0) {
      setIsDragOver(false)
    }
  }

  const handleDragEnd = () => {
    dragCounterRef.current = 0
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current = 0
    setIsDragOver(false)
    if (isUploading) return

    const validation = validateDroppedFiles(e.dataTransfer.files)
    if (!validation.valid) {
      onError?.(validation.error ?? 'Tệp tin không hợp lệ.')
      return
    }

    if (validation.file) {
      setFailedImageUrl(null)
      onUpload(validation.file)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const validation = validateDroppedFiles(e.target.files)
    if (!validation.valid) {
      onError?.(validation.error ?? 'Tệp tin không hợp lệ.')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    if (validation.file) {
      setFailedImageUrl(null)
      onUpload(validation.file)
    }
    // Reset file input so selecting the same file again triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFilePicker = () => {
    if (!isUploading) {
      fileInputRef.current?.click()
    }
  }

  const hasMapImage = Boolean(mapImageUrl)

  return (
    <div
      data-testid="map-upload-canvas"
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop}
      className={`relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-[10px] border border-solid transition-colors min-h-[380px] lg:min-h-0 w-full bg-white ${
        isDragOver
          ? 'border-2 border-dashed border-[#de3336] bg-red-50/20'
          : 'border-[#e5e5e5]'
      } ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        aria-label="Tải ảnh sơ đồ trận đấu"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Drag Over Overlay */}
      {isDragOver && !isUploading && (
        <div
          data-testid="drag-overlay"
          className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 bg-white/90 backdrop-blur-xs border-2 border-dashed border-[#de3336] rounded-[10px] pointer-events-none transition-all"
        >
          <UploadIcon className="size-8 text-[#de3336]" />
          <p className="text-sm font-medium text-[#de3336]">
            {hasMapImage ? 'Thả ảnh vào đây để thay đổi sơ đồ' : 'Thả ảnh vào đây để tải lên'}
          </p>
        </div>
      )}

      {/* Uploading State */}
      {isUploading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-xs">
          <Spinner size="lg" />
          <p className="text-sm font-medium text-[#1a1c1c]">Đang tải ảnh bản đồ...</p>
        </div>
      )}

      {/* Uploaded State */}
      {hasMapImage && !isUploading ? (
        <div className="relative flex size-full flex-1 items-center justify-center p-4 overflow-hidden">
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="secondary"
              size="sm"
              onClick={openFilePicker}
              leadingIcon={<UploadIcon className="size-4" />}
              className="outline-none focus-visible:ring-2 focus-visible:ring-[#de3336] focus-visible:ring-offset-2"
            >
              Thay đổi ảnh bản đồ
            </Button>
          </div>
          {isImageError ? (
            <div className="flex flex-col items-center justify-center gap-3 text-center p-6">
              <p className="text-sm font-medium text-[#de3336]">
                Không thể tải hiển thị ảnh sơ đồ trận đấu.
              </p>
              <p className="text-xs text-[#5e5e5e]">
                Vui lòng thử lại hoặc bấm nút phía trên để tải lại ảnh mới.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setFailedImageUrl(null)}
                className="outline-none focus-visible:ring-2 focus-visible:ring-[#de3336] focus-visible:ring-offset-2"
              >
                Thử tải lại ảnh
              </Button>
            </div>
          ) : (
            <img
              src={mapImageUrl!}
              alt="Sơ đồ trận đấu"
              onLoad={() => setFailedImageUrl(null)}
              onError={() => setFailedImageUrl(mapImageUrl ?? null)}
              className="max-h-full max-w-full object-contain rounded-md shadow-xs select-none"
            />
          )}
        </div>
      ) : (
        /* Empty State matching Figma node 1745:276, 1745:277 */
        !isUploading && (
          <button
            type="button"
            aria-label="Thêm ảnh bản đồ"
            onClick={openFilePicker}
            className="flex flex-col items-center justify-center gap-2.5 p-8 rounded-lg cursor-pointer hover:opacity-80 transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-[#de3336] focus-visible:ring-offset-2"
          >
            {/* Plus Icon matching Figma node 1745:278 */}
            <div className="relative flex size-6 items-center justify-center text-black">
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                aria-hidden="true"
              >
                <line
                  x1="10.5"
                  y1="0"
                  x2="10.5"
                  y2="21"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <line
                  x1="0"
                  y1="10.5"
                  x2="21"
                  y2="10.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            </div>
            {/* Label matching Figma node 1745:281 */}
            <span className="text-[16px] font-light text-black tracking-[0.66px]">
              Thêm ảnh bản đồ
            </span>
          </button>
        )
      )}
    </div>
  )
}
