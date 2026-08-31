import { useState } from 'react'
import { Button, Drawer, Input, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/core/shared'
import type { Card } from '../../model/card.contract'

type Props = {
  cards: Card[]
  open: boolean
  scheduled: boolean
  pending: boolean
  onClose: () => void
  onSubmit: (scheduledAt: string | undefined, quantities: Record<string, number>) => void
}

export const BulkRestockDrawer = ({ cards, open, scheduled, pending, onClose, onSubmit }: Props) => {
  const [quantities, setQuantities] = useState<Record<string, string>>({})
  const [scheduledAt, setScheduledAt] = useState('')

  const submit = () => {
    const normalized = Object.fromEntries(
      cards.map((card) => [card.cardId, Math.max(0, Number.parseInt(quantities[card.cardId] || '0', 10) || 0)]),
    )
    onSubmit(scheduled ? scheduledAt : undefined, normalized)
  }

  return (
    <Drawer
      open={open}
      title={scheduled ? 'Hẹn giờ nhập kho' : 'Nhập kho hàng loạt'}
      panelClassName="!max-w-[680px]"
      onClose={onClose}
      footer={<><Button variant="secondary" onClick={onClose}>Hủy</Button><Button disabled={pending || (scheduled && !scheduledAt)} onClick={submit}>{pending ? 'Đang lưu...' : 'Lưu'}</Button></>}
    >
      {scheduled ? <Input label="Ngày giờ tự động nhập" type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} /> : null}
      <div className={scheduled ? 'mt-6' : ''}>
        <Table>
          <TableHead><TableRow><TableHeaderCell>Tên card</TableHeaderCell><TableHeaderCell>Số lượng còn</TableHeaderCell><TableHeaderCell>Số lượng nhập thêm</TableHeaderCell><TableHeaderCell>Tổng</TableHeaderCell></TableRow></TableHead>
          <TableBody>
            {cards.map((card) => {
              const added = Number.parseInt(quantities[card.cardId] || '0', 10) || 0
              return <TableRow key={card.cardId}>
                <TableCell className="font-medium">{card.cardName}</TableCell>
                <TableCell>{card.remainingStock}</TableCell>
                <TableCell><input aria-label={`Nhập thêm ${card.cardName}`} className="h-9 w-28 rounded-lg border border-[#e2e2e2] px-3 text-sm outline-none focus:border-[#de3336]" type="number" min="0" value={quantities[card.cardId] ?? ''} onChange={(event) => setQuantities((current) => ({ ...current, [card.cardId]: event.target.value }))} /></TableCell>
                <TableCell className="font-semibold">{card.remainingStock + added}</TableCell>
              </TableRow>
            })}
          </TableBody>
        </Table>
      </div>
    </Drawer>
  )
}
