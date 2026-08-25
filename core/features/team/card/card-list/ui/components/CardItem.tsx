import type { CardItemDto } from '../../model/cardList.contract'

export type CardItemProps = {
  card: CardItemDto
  onClick: () => void
}

export const CardItem = ({ card, onClick }: CardItemProps) => {
  const getCardTypeName = (type: string) => {
    switch (type) {
      case 'activated':
        return 'Chủ động kích hoạt'
      case 'attacked':
        return 'Tự động kích hoạt khi bị tấn công'
      default:
        return 'Thẻ chức năng'
    }
  }

  const isPublished = card.cardStatus === 'published'

  return (
    <div
      onClick={onClick}
      className="mb-4 flex cursor-pointer overflow-hidden rounded-xl border border-[#e2e2e2] bg-white shadow-sm transition-transform active:scale-[0.98]"
    >
      <div className="h-[120px] w-[88px] shrink-0 bg-[#166534]">
        {card.cardUrl ? (
          <img
            src={card.cardUrl}
            alt={card.cardName}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-sm font-bold text-[#111111] line-clamp-1">{card.cardName}</h3>
        <p className="mt-1 text-xs text-[#8a8a8a]">{getCardTypeName(card.cardType)}</p>

        <hr className="my-2.5 border-t border-[#f5f5f5]" />

        <div className="mt-auto flex items-center gap-2 text-xs">
          <span className="text-[#5e5e5e]">Trạng thái:</span>
          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
              isPublished
                ? 'bg-green-50 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            <span
              className={`block size-1.5 rounded-full ${
                isPublished ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
            <span className="font-medium text-[11px]">
              {isPublished ? 'Có thể sử dụng' : 'Không thể sử dụng'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}