import { useRef, useState, useEffect } from 'react'
import { ReturnHeader } from '../../../../../shared/ui/ReturnHeader'
import { useFilePreview } from '../../model/frontend/useFilePreview'
import type { FileSource } from '../hooks/useSecretMissionDetailContainer'

export type SecretMissionEvidencePreviewProps = {
  missionName: string
  file: File
  source: FileSource
  onCancel: () => void
  onUpdateFile: (file: File) => void
  onConfirmUpload: () => void
  isSubmitting: boolean
}

export const SecretMissionEvidencePreview = ({
  file,
  source,
  onCancel,
  onUpdateFile,
  onConfirmUpload,
  isSubmitting
}: SecretMissionEvidencePreviewProps) => {
  const previewUrl = useFilePreview(file)
  const hiddenInputRef = useRef<HTMLInputElement>(null)
  
  const isVideo = file.type.startsWith('video/')

  // State để lưu trạng thái ảnh dài hay ngắn
  const [isLongImage, setIsLongImage] = useState(false)

  // Reset state mỗi khi previewUrl thay đổi (user chọn ảnh mới)
  useEffect(() => {
    setIsLongImage(false)
  }, [previewUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      onUpdateFile(selectedFile)
    }
    if (hiddenInputRef.current) hiddenInputRef.current.value = ''
  }

  // Hàm tính toán tỉ lệ ảnh khi vừa load xong
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget
    
    if (naturalWidth && naturalHeight) {
      const ratio = naturalHeight / naturalWidth
      
      // =====================================================================
      // 🎯 NƠI BẠN TỰ ĐIỀU CHỈNH NGƯỠNG TỈ LỆ ẢNH (THRESHOLD)
      // =====================================================================
      // - Ảnh vuông (1:1) => ratio = 1
      // - Ảnh ngang (4:3) => ratio = 0.75
      // - Ảnh dọc (3:2)   => ratio = 1.5
      // - Ảnh dọc (16:9 - Chụp từ điện thoại) => ratio ≈ 1.77
      // 
      // Hãy thử thay đổi số 1.5 bên dưới thành 1.3 hoặc 1.7 để cảm nhận sự khác biệt.
      const IMAGE_RATIO_THRESHOLD = 1.5
      // =====================================================================

      setIsLongImage(ratio > IMAGE_RATIO_THRESHOLD)
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-white w-full">
      
      <header className="shrink-0 bg-white">
        <ReturnHeader title={`Xác nhận minh chứng`} onBack={onCancel} />
      </header>

      <div className="relative flex-1 w-full min-h-0 bg-white">
        
        {previewUrl ? (
          isVideo ? (
            <video
              src={previewUrl}
              // VIDEO: Luôn luôn bị gọt đáy 84px để nhường chỗ cho Footer và hiện thanh Controls
              className="absolute left-0 right-0 top-0 h-[calc(100%-84px)] w-full object-contain"
              controls
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={previewUrl}
              alt="Preview"
              onLoad={handleImageLoad}
              // ẢNH: Chuyển đổi class động dựa trên tỉ lệ ảnh
              className={
                isLongImage
                  ? 'absolute inset-0 h-full w-full object-contain' // Ảnh dài: Tràn xuống dưới Footer
                  : 'absolute left-0 right-0 top-0 h-[calc(100%-84px)] w-full object-contain' // Ảnh ngắn/vuông: Bị gọt đáy để nổi lên chính giữa
              }
            />
          )
        ) : null}

        <footer className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between bg-transparent px-3 pb-6 pointer-events-none">
          
          <button
            type="button"
            onClick={() => hiddenInputRef.current?.click()}
            className="pointer-events-auto rounded-xl border border-gray-200 bg-gray-100 px-6 py-2.5 font-medium text-gray-700 shadow-md transition-colors hover:bg-gray-200 active:scale-95"
          >
            {source === 'camera' ? 'Chụp lại' : 'Chọn lại'}
          </button>

          <button
            type="button"
            onClick={onConfirmUpload}
            disabled={isSubmitting}
            className="pointer-events-auto rounded-xl bg-[#de3336] px-10 py-2.5 font-semibold text-white shadow-md transition-colors hover:bg-[#c82d2f] active:scale-95"
          >
            Lưu
          </button>
        </footer>

      </div>

      <input
        type="file"
        accept="image/*,video/*"
        capture={source === 'camera' ? 'environment' : undefined}
        ref={hiddenInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}