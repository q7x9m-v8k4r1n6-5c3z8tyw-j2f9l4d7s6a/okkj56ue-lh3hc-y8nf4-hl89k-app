import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge, Button, Drawer, Skeleton, Table, TableBody, TableCell, TableRow, useConfirmDialog, useToast } from '@/core/shared'
import { MobileScreenLayout } from '@/core/shared/ui/MobileScreenLayout'
import type { CardShopItem } from '../../model/card.contract'
import { usePurchaseTeamCard, useTeamCardShop } from '../../model/server/useCardQueries'

const purchaseStorageKey = (raceId: string, cardId: string) =>
  `move:card-purchase:${raceId}:${cardId}`

const stockPercent = (card: CardShopItem) => card.maxStock > 0
  ? Math.min(100, Math.max(0, (card.remainingStock / card.maxStock) * 100))
  : 0

export const TeamCardShopView = () => {
  const { raceId = '' } = useParams<{ raceId: string }>()
  const navigate = useNavigate()
  const shopQuery = useTeamCardShop(raceId)
  const purchaseMutation = usePurchaseTeamCard(raceId)
  const { confirm } = useConfirmDialog()
  const { toast } = useToast()
  const [selectedCard, setSelectedCard] = useState<CardShopItem | null>(null)
  const shop = shopQuery.data

  const purchase = async (card: CardShopItem) => {
    const accepted = await confirm({
      title: `Mua ${card.cardName}?`,
      description: `${card.price.toLocaleString('vi-VN')} CD sẽ được trừ ngay sau khi giao dịch thành công.`,
    })
    if (!accepted) return

    const storageKey = purchaseStorageKey(raceId, card.cardId)
    const purchaseId = sessionStorage.getItem(storageKey) ?? crypto.randomUUID()
    sessionStorage.setItem(storageKey, purchaseId)
    purchaseMutation.mutate(
      { cardId: card.cardId, purchaseId },
      {
        onSuccess: (result) => {
          if (result.status === 'received') sessionStorage.removeItem(storageKey)
          setSelectedCard(null)
          toast({
            title: result.status === 'received' ? 'Mua Data Patch thành công' : 'Giao dịch đang đồng bộ',
            description: result.message,
            variant: result.status === 'received' ? 'success' : 'warning',
          })
        },
        onError: (error) => toast({
          title: 'Không thể mua Data Patch',
          description: error instanceof Error ? error.message : 'Vui lòng thử lại với cùng giao dịch.',
          variant: 'danger',
        }),
      },
    )
  }

  const isUnavailable = (card: CardShopItem) =>
    !shop?.storeOpen || !shop.remainingSlots || card.remainingStock <= 0 || purchaseMutation.isPending

  return (
    <MobileScreenLayout
      title="Cửa hàng Data Patch"
      onBack={() => navigate(`/team/races/${raceId}`)}
      contentClassName="px-3"
    >
      {shop ? (
        <div className="mb-4 rounded-[16px] border border-[#e2e2e2] bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-[#737373]">Giới hạn mua trong race</p>
              <p className="mt-0.5 text-sm font-semibold text-[#262626]">{shop.purchasedCount}/{shop.maxDataPatchPerTeam} card · còn {shop.remainingSlots} lượt</p>
            </div>
            <Badge variant={shop.storeOpen ? 'success' : 'neutral'}>{shop.storeOpen ? 'Đang mở' : 'Đang đóng'}</Badge>
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[20px] border border-[#e2e2e2] bg-white shadow-sm">
        <Table>
          <TableBody>
            {shopQuery.isLoading ? (
              <>
                <TableRow><TableCell><Skeleton lines={2} className="h-12 w-full" /></TableCell></TableRow>
                <TableRow><TableCell><Skeleton lines={2} className="h-12 w-full" /></TableCell></TableRow>
              </>
            ) : shopQuery.isError || !shop ? (
              <TableRow><TableCell className="py-10 text-center italic text-red-500">Không thể tải cửa hàng Data Patch.</TableCell></TableRow>
            ) : shop.cards.map((card) => (
              <TableRow
                key={card.cardId}
                className="cursor-pointer transition-colors hover:bg-gray-50 active:bg-gray-100"
                onClick={() => setSelectedCard(card)}
              >
                <TableCell className="border-b border-[#f5f5f5] px-5 py-5 last:border-none">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-[#420001] underline underline-offset-4">{card.cardName}</span>
                      <span className="mt-1 block text-xs text-[#737373]">{card.price.toLocaleString('vi-VN')} CD</span>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-[#166534]">{card.remainingStock}/{card.maxStock}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e7f2e9]" aria-label={`Còn ${card.remainingStock} trên ${card.maxStock} card`}>
                    <div className="h-full rounded-full bg-[#39a852] transition-[width]" style={{ width: `${stockPercent(card)}%` }} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {shop && !shop.storeOpen ? <p className="mt-3 px-2 text-xs text-[#8a8a8a]">Admin chưa mở cửa hàng. Bạn vẫn có thể xem thông tin, giá và tồn kho.</p> : null}

      {selectedCard ? (
        <Drawer
          open
          title={`Thông tin ${selectedCard.cardName}`}
          panelClassName="!max-w-[430px]"
          onClose={() => setSelectedCard(null)}
          footer={<Button className="w-full rounded-full" disabled={isUnavailable(selectedCard)} onClick={() => void purchase(selectedCard)}>{purchaseMutation.isPending ? 'Đang mua...' : selectedCard.remainingStock <= 0 ? 'Hết hàng' : !shop?.storeOpen ? 'Cửa hàng đang đóng' : !shop.remainingSlots ? 'Đã đạt giới hạn mua' : `Mua với ${selectedCard.price.toLocaleString('vi-VN')} CD`}</Button>}
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <Badge variant="neutral">Data Patch</Badge>
              <span className="text-base font-bold text-[#420001]">{selectedCard.price.toLocaleString('vi-VN')} CD</span>
            </div>
            <p className="whitespace-pre-wrap text-[15px] leading-7 text-[#333333]">{selectedCard.description}</p>
            <div className="rounded-lg bg-[#fff7f7] p-3 text-sm leading-6 text-[#525252]">
              <span className="font-semibold text-[#420001]">Cách sử dụng: </span>{selectedCard.usage}
            </div>
            {selectedCard.inputs.length ? (
              <section>
                <h3 className="mb-2 text-sm font-semibold text-[#262626]">Thông tin cần chọn khi sử dụng</h3>
                <ul className="space-y-2">
                  {selectedCard.inputs.map((input) => <li key={input.key} className="rounded-lg border border-[#eeeeee] px-3 py-2"><span className="text-sm font-medium text-[#333333]">{input.label}</span><span className="mt-0.5 block text-xs leading-5 text-[#737373]">{input.description}</span></li>)}
                </ul>
              </section>
            ) : null}
            <section>
              <div className="flex items-center justify-between text-sm"><span className="text-[#737373]">Tồn kho</span><strong className="text-[#166534]">{selectedCard.remainingStock}/{selectedCard.maxStock}</strong></div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#e7f2e9]"><div className="h-full rounded-full bg-[#39a852]" style={{ width: `${stockPercent(selectedCard)}%` }} /></div>
            </section>
          </div>
        </Drawer>
      ) : null}
    </MobileScreenLayout>
  )
}
