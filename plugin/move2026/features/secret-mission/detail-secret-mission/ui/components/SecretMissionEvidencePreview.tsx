import { useRef, useState, useEffect } from 'react'
import { useFilePreview } from '../../model/frontend/useFilePreview'
import type { FileSource } from '../hooks/useSecretMissionDetailContainer'
import { MobileScreenLayout } from '@/core/shared/ui/MobileScreenLayout'

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

  const [isLongImage, setIsLongImage] = useState(false)

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

  return (
    <MobileScreenLayout
      title="Xác nhận minh chứng"
      onBack={onCancel}
      contentClassName="p-0" 
      isOverlayFooter={true} 
      footer={
        <>
          <button
            type="button"
            onClick={() => hiddenInputRef.current?.click()}
            className="rounded-xl border border-gray-200 bg-gray-100 px-6 py-2.5 font-medium text-gray-700 shadow-md transition-colors hover:bg-gray-200 active:scale-95"
          >
            {source === 'camera' ? 'Chụp lại' : 'Chọn lại'}
          </button>
          <button
            type="button"
            onClick={onConfirmUpload}
            disabled={isSubmitting}
            className="rounded-xl bg-[#de3336] px-10 py-2.5 font-semibold text-white shadow-md transition-colors hover:bg-[#c82d2f] active:scale-95"
          >
            Lưu
          </button>
        </>
      }
    >
      {previewUrl ? (
        isVideo ? (
           <video src={previewUrl} className="absolute left-0 right-0 top-0 h-[calc(100%-84px)] w-full object-contain" controls autoPlay playsInline />
        ) : (
           <img src={previewUrl} className={isLongImage ? 'absolute inset-0 h-full w-full object-contain' : 'absolute left-0 right-0 top-0 h-[calc(100%-84px)] w-full object-contain'} />
        )
      ) : null}

      <input type="file" accept="image/*,video/*" capture={source === 'camera' ? 'environment' : undefined} ref={hiddenInputRef} onChange={handleFileChange} className="hidden" />
    </MobileScreenLayout>
  )
}