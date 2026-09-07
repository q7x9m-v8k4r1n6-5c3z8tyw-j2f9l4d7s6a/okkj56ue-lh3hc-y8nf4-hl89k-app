import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CardMembershipIcon, UploadIcon } from '@/core/assets'
import { useAuthSession } from '@/core/features/auth'
import { Badge, Button, IconButton, Table, TableBody, TableCard, TableCell, TableHead, TableHeaderCell, TableRow, useConfirmDialog, useToast } from '@/core/shared'
import { useCardStore, useCardStoreMutations, useOverclockMutations, useOverclockWindow } from '../../model/server/useCardQueries'
import type { Card } from '../../model/card.contract'
import { BulkRestockDrawer } from './BulkRestockDrawer'
import { CardTeamDrawer } from './CardTeamDrawer'

export const CardStoreManagementView = () => {
  const { raceId = '' } = useParams<{ raceId: string }>()
  const storeQuery = useCardStore(raceId)
  const mutations = useCardStoreMutations(raceId)
  const overclockQuery = useOverclockWindow(raceId)
  const overclockMutations = useOverclockMutations(raceId)
  const { user } = useAuthSession()
  const { confirm } = useConfirmDialog()
  const { toast } = useToast()
  const [restockOpen, setRestockOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)

  const cards = storeQuery.data?.cards ?? []
  const isAdmin = user?.roles.some((role) => role.toLowerCase() === 'admin') ?? false
  const overclockStatus = overclockQuery.data?.status ?? 'not_opened'
  const overclockStatusLabel = {
    not_opened: 'Chưa mở',
    open: 'Đang nhận dự đoán',
    closed: 'Đang cần đối soát',
    resolved: 'Đã chốt',
  }[overclockStatus]
  const errorMessage = storeQuery.error instanceof Error ? storeQuery.error.message : 'Không thể tải dữ liệu cửa hàng.'
  const submitRestock = (quantities: Record<string, number>) => {
    mutations.restock.mutate(quantities, { onSuccess: () => { setRestockOpen(false); toast({ title: 'Đã nhập kho' }) } })
  }
  const openOverclock = async () => {
    const accepted = await confirm({
      title: 'Mở màn dự đoán Overclock?',
      description: 'Các đội sở hữu Overclock sẽ có thể gửi toàn bộ dự đoán một lần.',
    })
    if (!accepted) return
    overclockMutations.open.mutate(undefined, {
      onSuccess: () => toast({ title: 'Đã mở màn dự đoán Overclock' }),
      onError: (error) => toast({ title: 'Không thể mở Overclock', description: error instanceof Error ? error.message : 'Vui lòng thử lại.', variant: 'danger' }),
    })
  }
  const resolveOverclock = async () => {
    const accepted = await confirm({
      title: 'Chốt toàn bộ dự đoán Overclock?',
      description: 'Hành động này đóng màn dự đoán, đối chiếu kết quả finalized và không thể mở lại.',
    })
    if (!accepted) return
    overclockMutations.resolve.mutate(undefined, {
      onSuccess: (result) => {
        const description = `${result.correctCount} đúng · ${result.incorrectCount} sai · ${result.notEvaluatedCount} chưa đủ dữ liệu`
        if (result.status === 'resolved') toast({ title: 'Đã chốt Overclock', description })
        else toast({ title: 'Điểm đã xử lý, dữ liệu card cần đối soát', description, variant: 'danger' })
      },
      onError: (error) => toast({ title: 'Không thể chốt Overclock', description: error instanceof Error ? error.message : 'Vui lòng thử lại.', variant: 'danger' }),
    })
  }

  return <section className="space-y-5">
    <div className="space-y-2 rounded-lg border border-[#e5e5e5] bg-white px-3 py-2 shadow-none">
      <div className="flex min-h-9 flex-wrap items-center gap-2"><Button size="sm" variant="secondary" leadingIcon={<UploadIcon className="size-5" />} onClick={() => setRestockOpen(true)}>Nhập kho</Button><span className="ml-auto text-xs text-[#737373]">Cấp card cho team trong phần chi tiết từng card.</span></div>
      <div className="flex min-h-10 flex-wrap items-center gap-2 border-t border-[#eeeeee] pt-2">
        <div className="mr-auto"><p className="text-sm font-semibold text-[#262626]">Màn dự đoán Overclock</p><p className="text-xs text-[#737373]">Admin mở sau giai đoạn booth và chốt trước game cuối.</p></div>
        <Badge variant={overclockStatus === 'open' ? 'success' : overclockStatus === 'closed' ? 'danger' : 'neutral'}>{overclockStatusLabel}</Badge>
        {isAdmin && overclockStatus === 'not_opened' ? <Button size="sm" disabled={overclockMutations.open.isPending} onClick={() => void openOverclock()}>{overclockMutations.open.isPending ? 'Đang mở...' : 'Mở dự đoán'}</Button> : null}
        {isAdmin && overclockStatus === 'open' ? <Button size="sm" disabled={overclockMutations.resolve.isPending} onClick={() => void resolveOverclock()}>{overclockMutations.resolve.isPending ? 'Đang chốt...' : 'Chốt kết quả'}</Button> : null}
      </div>
    </div>
    <header className="flex items-center gap-2">
      <CardMembershipIcon className="size-6 text-[#de3336]" />
      <div>
        <h2 className="text-xl font-semibold text-[#262626]">Danh sách card mặc định</h2>
        </div>
        </header>
    <TableCard>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Tên card</TableHeaderCell>
            <TableHeaderCell>Mô tả</TableHeaderCell>
            <TableHeaderCell>Giá tiền</TableHeaderCell>
            <TableHeaderCell>Số lượng còn trong kho</TableHeaderCell>
            <TableHeaderCell /></TableRow></TableHead><TableBody>{cards.map((card) => <TableRow key={card.cardId}><TableCell><button type="button" className="text-left font-semibold text-[#420001] hover:underline" onClick={() => setSelectedCard(card)}>{card.cardName}</button><span className="mt-1 block text-xs text-[#737373]">Mã: {card.cardId}</span></TableCell><TableCell><p className="max-w-md text-xs text-[#737373]">{card.description}</p><p className="mt-1 text-xs text-[#a3a3a3]">Cách dùng: {card.usage}</p></TableCell><TableCell>{card.price > 0 ? `${card.price.toLocaleString('vi-VN')} đ` : 'Miễn phí'}</TableCell><TableCell><Badge variant={card.remainingStock > 0 ? 'success' : 'danger'}>{card.remainingStock}</Badge></TableCell><TableCell><IconButton aria-label={`Mở chi tiết ${card.cardName}`} icon={<span className="text-lg">›</span>} onClick={() => setSelectedCard(card)} /></TableCell></TableRow>)}</TableBody></Table>{storeQuery.isLoading ? <p className="px-6 py-5 text-sm text-[#737373]">Đang tải cửa hàng...</p> : null}{storeQuery.isError ? <p className="border-t border-[#fee2e2] bg-[#fff7f7] px-6 py-5 text-sm text-[#b91c1c]">{errorMessage}</p> : null}{!storeQuery.isLoading && !storeQuery.isError && cards.length === 0 ? <p className="px-6 py-8 text-center text-sm text-[#737373]">Chưa có card mặc định.</p> : null}</TableCard>
    {restockOpen ? <BulkRestockDrawer cards={cards} open pending={mutations.restock.isPending} onClose={() => setRestockOpen(false)} onSubmit={submitRestock} /> : null}
    {selectedCard ? <CardTeamDrawer key={selectedCard.cardId} card={selectedCard} open raceId={raceId} pending={mutations.config.isPending || mutations.assign.isPending || mutations.remove.isPending} onClose={() => setSelectedCard(null)} onSaveConfig={(cardId, config) => mutations.config.mutateAsync({ cardId, config }).then(() => undefined)} onAssign={(input) => mutations.assign.mutateAsync(input).then(() => undefined)} onDelete={(input) => mutations.remove.mutateAsync(input).then(() => undefined)} /> : null}
  </section>
}
