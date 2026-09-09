import { useMemo, useState } from 'react'
import { MobileScreenLayout } from '@/core/shared/ui/MobileScreenLayout'
import type { TechCacheResultType } from '../../model/techcache.contract'

type TechCacheResultPreviewProps = {
  video: File
  onRetake: () => void
  onSubmitResult: (result: TechCacheResultType) => void
  isSubmitting: boolean
}

export const TechCacheResultPreview = ({
  video,
  onRetake,
  onSubmitResult,
  isSubmitting,
}: TechCacheResultPreviewProps) => {
  const videoUrl = useMemo(() => URL.createObjectURL(video), [video])
  const [pendingResult, setPendingResult] = useState<TechCacheResultType | null>(null)

  const handleClick = (result: TechCacheResultType) => {
    setPendingResult(result)
    onSubmitResult(result)
  }

  return (
    <MobileScreenLayout
      title="Xác nhận kết quả Tech Cache"
      onBack={onRetake}
      contentClassName="p-0"
      isOverlayFooter={true}
      footer={
        <>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleClick('fail')}
            className="flex-1 rounded-xl bg-[#de3336] py-3 text-center font-bold text-white shadow transition-transform active:scale-95 disabled:opacity-50"
          >
            {isSubmitting && pendingResult === 'fail' ? 'Đang gửi...' : 'Thất bại'}
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleClick('success')}
            className="flex-1 rounded-xl bg-[#10b981] py-3 text-center font-bold text-white shadow transition-transform active:scale-95 disabled:opacity-50"
          >
            {isSubmitting && pendingResult === 'success' ? 'Đang gửi...' : 'Thành công'}
          </button>
        </>
      }
    >
      <video
        src={videoUrl}
        controls
        autoPlay
        className="absolute left-0 right-0 top-0 h-[calc(100%-84px)] w-full object-contain"
      />
    </MobileScreenLayout>
  )
}