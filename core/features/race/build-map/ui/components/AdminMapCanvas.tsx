import { useRef, useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { Spinner } from '@/core/shared'

export interface AdminMapCanvasProps {
  previewUrl: string
  fileName?: string
  fileSize?: number
  isDirty?: boolean
  isSaving?: boolean
  isLocked?: boolean
  onSave?: () => void
  onCancel?: () => void
  onRemoveImage: () => void
  onFileSelect: (file: File) => void
}

/** Format file size in bytes to human readable MB/KB */
const formatFileSize = (bytes?: number): string => {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/**
 * Interactive map viewport supporting zoom, pan, reset, file replacement, and save/cancel actions.
 * Conforms to Figma Node 1719-1328.
 */
export const AdminMapCanvas = ({
  previewUrl,
  fileName = 'Bản đồ trận đấu',
  fileSize,
  isDirty = false,
  isSaving = false,
  isLocked = false,
  onSave,
  onCancel,
  onRemoveImage,
  onFileSelect,
}: AdminMapCanvasProps) => {
  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const [imageLoadError, setImageLoadError] = useState(false)

  const handleHiddenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0])
    }
  }

  const handleTriggerChangeImage = () => {
    hiddenInputRef.current?.click()
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Hidden file input for replacing current map image */}
      <input
        ref={hiddenInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onClick={(e) => {
          e.currentTarget.value = ''
        }}
        onChange={(e) => {
          handleHiddenInputChange(e)
          e.target.value = ''
        }}
        className="hidden"
        data-testid="replace-map-file-input"
      />

      <TransformWrapper
        key={previewUrl}
        initialScale={1}
        minScale={0.2}
        maxScale={8}
        centerOnInit
        wheel={{ step: 0.1 }}
      >
        {({ zoomIn, zoomOut, resetTransform, state }) => (
          <div className="flex w-full flex-col rounded-[16px] border border-[#e5e5e5] bg-white shadow-xs overflow-hidden">
            {/* Canvas Header & Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 py-3">
              {/* File Info */}
              <div className="flex items-center gap-2 overflow-hidden min-w-[180px]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>
                <div className="truncate">
                  <h4 className="truncate text-xs font-semibold text-slate-800">
                    {fileName}
                  </h4>
                  {fileSize ? (
                    <span className="text-2xs text-slate-500">
                      {formatFileSize(fileSize)}
                    </span>
                  ) : (
                    <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full mt-0.5">
                      Đã lưu trên hệ thống
                    </span>
                  )}
                </div>
              </div>

              {/* Zoom & Pan Controls */}
              <div className="flex items-center gap-1 rounded-lg border border-[#e5e5e5] bg-white p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => zoomOut()}
                  title="Thu nhỏ"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>

                <span className="min-w-[44px] text-center text-xs font-semibold text-slate-700 select-none">
                  {Math.round((state.scale ?? 1) * 100)}%
                </span>

                <button
                  type="button"
                  onClick={() => zoomIn()}
                  title="Phóng to"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>

                <div className="mx-1 h-3.5 w-px bg-slate-200" />

                <button
                  type="button"
                  onClick={() => resetTransform()}
                  title="Đặt lại góc nhìn"
                  className="flex h-7 px-2 items-center gap-1 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reset
                </button>
              </div>

              {/* Action Buttons: Save / Cancel / Replace / Remove */}
              <div className="flex items-center gap-2">
                {isDirty && (
                  <>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={onSave}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#de3336] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#c82528] active:bg-[#b01e21] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                      data-testid="save-map-btn"
                    >
                      {isSaving ? (
                        <>
                          <Spinner size="sm" className="text-white" />
                          <span>Đang lưu...</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Lưu bản đồ</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={onCancel}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#e5e5e5] bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors disabled:opacity-60"
                      data-testid="cancel-map-btn"
                    >
                      Hủy
                    </button>
                  </>
                )}

                {!isLocked && (
                  <>
                    <button
                      type="button"
                      onClick={handleTriggerChangeImage}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs hover:bg-neutral-50 transition-colors"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      Đổi ảnh
                    </button>

                    <button
                      type="button"
                      onClick={onRemoveImage}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 shadow-2xs hover:bg-red-100 transition-colors"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Xóa ảnh
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Interactive Viewport */}
            <div className="relative flex h-[580px] w-full items-center justify-center bg-slate-950 overflow-hidden cursor-grab active:cursor-grabbing">
              {imageLoadError ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-slate-300">
                  <svg
                    className="h-10 w-10 text-red-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <p className="text-sm font-medium text-slate-200">
                    Không thể tải hoặc hiển thị ảnh bản đồ này
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    File ảnh có thể bị lỗi hoặc định dạng không tương thích.
                  </p>
                  <button
                    type="button"
                    onClick={handleTriggerChangeImage}
                    className="mt-4 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Chọn ảnh khác
                  </button>
                </div>
              ) : (
                <TransformComponent
                  wrapperClass="!w-full !h-full flex items-center justify-center"
                  contentClass="flex items-center justify-center min-w-full min-h-full"
                >
                  <img
                    src={previewUrl}
                    alt={fileName}
                    className="max-h-full max-w-full object-contain select-none shadow-2xl"
                    draggable={false}
                    onError={() => setImageLoadError(true)}
                  />
                </TransformComponent>
              )}

              {!imageLoadError && (
                <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-3.5 py-1.5 text-xs text-neutral-600 backdrop-blur-md shadow-sm border border-neutral-200/80">
                  Dùng chuột lăn hoặc drag để Zoom / Pan bản đồ
                </div>
              )}
            </div>
          </div>
        )}
      </TransformWrapper>
    </div>
  )
}
