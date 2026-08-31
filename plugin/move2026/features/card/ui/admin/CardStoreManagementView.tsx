import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CardMembershipIcon, PlayCircleIcon, StopCircleIcon, UploadIcon } from '@/core/assets'
import { Badge, Button, IconButton, Table, TableBody, TableCard, TableCell, TableHead, TableHeaderCell, TableRow, useToast } from '@/core/shared'
import { useCardStore, useCardStoreMutations } from '../../model/server/useCardQueries'
import type { Card } from '../../model/card.contract'
import { BulkRestockDrawer } from './BulkRestockDrawer'
import { CardTeamDrawer } from './CardTeamDrawer'

export const CardStoreManagementView = () => {
  const { raceId = '' } = useParams<{ raceId: string }>()
  const storeQuery = useCardStore(raceId)
  const mutations = useCardStoreMutations(raceId)
  const { toast } = useToast()
  const [restockOpen, setRestockOpen] = useState(false)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)

  const cards = storeQuery.data?.cards ?? []
  const errorMessage = storeQuery.error instanceof Error ? storeQuery.error.message : 'Không thể tải dữ liệu cửa hàng.'
  const toggleStore = () => mutations.store.mutate(!storeQuery.data?.storeOpen, { onSuccess: () => toast({ title: storeQuery.data?.storeOpen ? 'Đã đóng cửa hàng' : 'Đã mở cửa hàng' }) })
  const submitRestock = (scheduledAt: string | undefined, quantities: Record<string, number>) => {
    if (scheduledAt) mutations.schedule.mutate({ scheduledAt: new Date(scheduledAt).toISOString(), quantities }, { onSuccess: () => { setScheduleOpen(false); toast({ title: 'Đã hẹn giờ nhập kho' }) } })
    else mutations.restock.mutate(quantities, { onSuccess: () => { setRestockOpen(false); toast({ title: 'Đã nhập kho' }) } })
  }

  return <section className="space-y-5">
    <div className="rounded-lg border border-[#e5e5e5] bg-white px-3 py-2 shadow-none"><div className="flex min-h-9 flex-wrap items-center gap-2"><Button size="sm" leadingIcon={storeQuery.data?.storeOpen ? <StopCircleIcon className="size-5" /> : <PlayCircleIcon className="size-5" />} onClick={toggleStore} disabled={mutations.store.isPending}>{storeQuery.data?.storeOpen ? 'Đóng cửa hàng' : 'Mở cửa hàng'}</Button><Button size="sm" variant="secondary" leadingIcon={<UploadIcon className="size-5" />} onClick={() => setRestockOpen(true)}>Nhập kho</Button><Button size="sm" variant="secondary" leadingIcon={<UploadIcon className="size-5" />} onClick={() => setScheduleOpen(true)}>Hẹn giờ nhập</Button><span className={`ml-auto rounded-xl px-3 py-1.5 text-sm ${storeQuery.data?.storeOpen ? 'bg-[#e9f8ef] text-[#168944]' : 'bg-[#f1f1f1] text-[#737373]'}`}>{storeQuery.data?.storeOpen ? 'Cửa hàng đang mở' : 'Cửa hàng đang đóng'}</span></div></div>
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
    {restockOpen || scheduleOpen ? <BulkRestockDrawer key={scheduleOpen ? 'schedule' : 'restock'} cards={cards} open scheduled={scheduleOpen} pending={mutations.restock.isPending || mutations.schedule.isPending} onClose={() => { setRestockOpen(false); setScheduleOpen(false) }} onSubmit={submitRestock} /> : null}
    {selectedCard ? <CardTeamDrawer key={selectedCard.cardId} card={selectedCard} open raceId={raceId} pending={mutations.config.isPending || mutations.assign.isPending || mutations.remove.isPending} onClose={() => setSelectedCard(null)} onSaveConfig={(cardId, config) => mutations.config.mutateAsync({ cardId, config }).then(() => undefined)} onAssign={(input) => mutations.assign.mutateAsync(input).then(() => undefined)} onDelete={(input) => mutations.remove.mutateAsync(input).then(() => undefined)} /> : null}
  </section>
}
