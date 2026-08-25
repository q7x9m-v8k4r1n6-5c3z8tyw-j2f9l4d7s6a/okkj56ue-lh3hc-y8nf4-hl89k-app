import { MobileScreenLayout } from '@/core/shared/ui/MobileScreenLayout'
import { Skeleton } from '@/core/shared'
import { useCardListView } from './hooks/useCardListView'
import { CardItem } from './components/CardItem'

export const CardListView = () => {
  const view = useCardListView()

  return (
    <MobileScreenLayout
      title="Danh sách thẻ chức năng"
      onBack={view.handleBack}
      contentClassName="px-4 py-5 bg-[#fafafa]"
    >
      {view.isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-[120px] w-full rounded-xl" />
          <Skeleton className="h-[120px] w-full rounded-xl" />
        </div>
      ) : view.isError ? (
        <div className="py-10 text-center italic text-red-500">
          Không thể tải danh sách thẻ. Vui lòng thử lại sau.
        </div>
      ) : view.cards?.length === 0 ? (
        <div className="py-10 text-center italic text-[#8a8a8a]">
          Kho thẻ của bạn đang trống.
        </div>
      ) : (
        <div className="flex flex-col">
          {view.cards?.map((card) => (
            <CardItem
              key={card.cardId}
              card={card}
              onClick={() => view.handleCardClick(card)}
            />
          ))}
        </div>
      )}
    </MobileScreenLayout>
  )
}