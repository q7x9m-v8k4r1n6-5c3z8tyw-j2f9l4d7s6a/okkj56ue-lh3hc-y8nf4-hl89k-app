import { MobileScreenLayout } from '@/core/shared/ui/MobileScreenLayout'
import { Skeleton } from '@/core/shared'
import { useCardDescriptionView } from './hooks/useCardDescriptionView'

export const CardDescriptionView = () => {
  const view = useCardDescriptionView()
  const isDisabled = view.cardStatus === 'disabled'

  // Hàm render Markdown cơ bản (hỗ trợ **chữ đậm** và \n xuống dòng)
  const renderSimpleMarkdown = (text: string) => {
    return (
      <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-[#333333]">
        {text.split('**').map((chunk, index) =>
          index % 2 === 1 ? (
            <strong key={index} className="font-bold text-[#111111]">
              {chunk}
            </strong>
          ) : (
            chunk
          )
        )}
      </div>
    )
  }

  return (
    <MobileScreenLayout
      title={`Thông tin ${view.cardName}`}
      onBack={view.handleBack}
      contentClassName="px-5 pt-4 bg-white"
      footer={
        <button
          type="button"
          onClick={view.handleUseCard}
          className={`flex w-full items-center justify-center rounded-full py-3 text-base font-semibold text-white transition-all active:scale-95 ${
            isDisabled
              ? 'bg-gray-400 opacity-60'
              : 'bg-[#de3336] hover:bg-[#c82d2f]'
          }`}
        >
          Sử dụng thẻ
        </button>
      }
    >
      {view.isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[85%]" />
          <Skeleton className="h-4 w-[95%]" />
        </div>
      ) : view.isError ? (
        <div className="py-10 text-center italic text-red-500">
          Không thể tải thông tin thẻ.
        </div>
      ) : view.cardInfo ? (
        renderSimpleMarkdown(view.cardInfo)
      ) : null}
    </MobileScreenLayout>
  )
}