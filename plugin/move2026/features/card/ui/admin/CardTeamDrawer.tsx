import { useEffect, useRef, useState } from 'react'
import { PlusIcon, SaveIcon, TrashIcon } from '@/core/assets'
import { Badge, Button, Drawer, IconButton, Input, Modal, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, useToast } from '@/core/shared'
import type { Card, CardTeam } from '../../model/card.contract'
import { useCardTeams, useRaceOptions } from '../../model/server/useCardQueries'

type Props = {
  card: Card | null
  open: boolean
  pending: boolean
  onClose: () => void
  onSaveConfig: (cardId: string, config: Record<string, unknown>) => Promise<void>
  onAssign: (input: { cardId: string; teamId: string; teamName: string; reason: string }) => Promise<void>
  onDelete: (input: { cardId: string; teamId: string; cardInstanceId: string; reason: string }) => Promise<void>
  raceId: string
}

const statusLabel: Record<CardTeam['status'], string> = { received: 'Chưa sử dụng', used: 'Đã sử dụng', deleted: 'Xóa' }

export const CardTeamDrawer = ({ card, open, pending, onClose, onSaveConfig, onAssign, onDelete, raceId }: Props) => {
  const teamsQuery = useCardTeams(raceId, card?.cardId)
  const raceOptionsQuery = useRaceOptions(raceId)
  const { toast } = useToast()
  const [configValues, setConfigValues] = useState<Record<string, string>>(() => Object.fromEntries(
    Object.entries(card?.config ?? {}).map(([key, value]) => [key, String(value)]),
  ))
  const [draft, setDraft] = useState<{ teamId: string; teamName: string; reason: string } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CardTeam | null>(null)
  const [deleteReason, setDeleteReason] = useState('')
  const draftRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!draft) return
    const onPointerDown = (event: PointerEvent) => {
      if (draftRef.current?.contains(event.target as Node)) return
      if (!draft.teamId && !draft.teamName && !draft.reason) setDraft(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [draft])

  if (!card) return null

  const teams = teamsQuery.data ?? []
  const saveConfig = async () => {
    try {
      const config = Object.fromEntries(Object.entries(configValues).map(([key, value]) => {
        const original = card.config[key]
        if (typeof original === 'number') return [key, Number(value)]
        if (typeof original === 'boolean') return [key, value === 'true']
        return [key, value]
      }))
      await onSaveConfig(card.cardId, config)
      toast({ title: 'Đã lưu cấu hình card' })
    } catch (error) {
      toast({ title: 'Không thể lưu cấu hình', description: error instanceof Error ? error.message : 'Vui lòng thử lại.', variant: 'danger' })
    }
  }
  const assign = async () => {
    if (!draft?.teamId || !draft.teamName) return
    await onAssign({ cardId: card.cardId, ...draft })
    setDraft(null)
  }
  const confirmDelete = async () => {
    if (!deleteTarget || !deleteReason.trim()) return
    await onDelete({ cardId: card.cardId, teamId: deleteTarget.teamId, cardInstanceId: deleteTarget.cardInstanceId, reason: deleteReason.trim() })
    setDeleteTarget(null)
    setDeleteReason('')
  }

  return (
    <>
      <Drawer open={open} title={`${card.cardName} · Danh sách team`} panelClassName="!max-w-[920px]" onClose={onClose}>
        <div className="space-y-6">
          <div className="rounded-xl border border-[#eeeeee] bg-[#fffafa] p-4">
            <div className="mb-3 flex items-center justify-between gap-3"><div><h3 className="text-sm font-semibold text-[#1a1c1c]">Cấu hình card</h3><p className="mt-1 text-xs text-[#737373]">Các input được định nghĩa bởi plugin. Trap dùng số điểm bị trừ.</p></div><Button size="sm" disabled={pending} leadingIcon={<SaveIcon className="size-4" />} onClick={() => void saveConfig()}>Lưu cấu hình</Button></div>
            <div className="grid gap-3 md:grid-cols-2">{Object.entries(configValues).map(([key, value]) => {
              const numeric = typeof card.config[key] === 'number'
              const invariant = ['requiredBoothType', 'qualificationMode', 'consumeWhen'].includes(key)
                || key === 'card_use_count_max' && teams.length > 0
              return <Input key={key} label={key} type={numeric ? 'number' : 'text'} min={numeric ? '0' : undefined} disabled={invariant} value={value} onChange={(event) => setConfigValues((current) => ({ ...current, [key]: event.target.value }))} />
            })}</div>
          </div>

          <div><h3 className="mb-3 text-sm font-semibold text-[#1a1c1c]">Danh sách team nhận card</h3><div ref={draftRef} className="overflow-x-auto rounded-xl border border-[#eeeeee]"><Table><TableHead><TableRow><TableHeaderCell>Tên team</TableHeaderCell><TableHeaderCell>Thời gian nhận</TableHeaderCell><TableHeaderCell>Lý do nhận</TableHeaderCell><TableHeaderCell>Thời gian sử dụng</TableHeaderCell><TableHeaderCell>Trạng thái</TableHeaderCell><TableHeaderCell>Hành động</TableHeaderCell></TableRow></TableHead><TableBody>
              {teams.map((team) => {
                const deleted = team.status === 'deleted'
                const struck = deleted ? 'line-through text-[#a3a3a3]' : ''
                const latestUse = team.cardUses.at(-1)
                return <TableRow key={team.cardInstanceId}>
                  <TableCell className={struck}>{team.teamName}</TableCell>
                  <TableCell className={struck}>{new Date(team.receivedAt).toLocaleString('vi-VN')}</TableCell>
                  <TableCell className={struck}>{team.receiveReason || '—'}</TableCell>
                  <TableCell className={struck}>{latestUse ? new Date(latestUse.usedAt).toLocaleString('vi-VN') : '—'}</TableCell>
                  <TableCell><Badge variant={team.status === 'used' ? 'success' : team.status === 'deleted' ? 'danger' : 'neutral'}>{deleted ? `Đã xóa. ${team.disabledReason || ''}` : `${statusLabel[team.status]} · còn ${team.cardUseCountRemain}`}</Badge></TableCell>
                  <TableCell>{team.canDelete ? <IconButton aria-label={`Xóa card của ${team.teamName}`} icon={<TrashIcon className="size-4" />} disabled={pending} onClick={() => { setDeleteTarget(team); setDeleteReason('') }} /> : <span className="text-xs text-[#a3a3a3]">—</span>}</TableCell>
                </TableRow>
              })}
              {draft ? <TableRow className="bg-[#fffdfd]"><TableCell><select aria-label="Chọn team" className="h-9 min-w-44 rounded-lg border border-[#e2e2e2] bg-white px-2 text-xs" value={draft.teamId} onChange={(event) => { const team = raceOptionsQuery.data?.teams.find((item) => item.id === event.target.value); setDraft((current) => current ? { ...current, teamId: event.target.value, teamName: team?.name ?? '' } : current) }}><option value="">Chọn team</option>{(raceOptionsQuery.data?.teams ?? []).map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}</select></TableCell><TableCell className="text-xs text-[#a3a3a3]">Mới</TableCell><TableCell><input aria-label="Lý do nhận" className="h-9 w-36 rounded-lg border border-[#e2e2e2] px-2 text-xs" placeholder="Lý do nhận" value={draft.reason} onChange={(event) => setDraft((current) => current ? { ...current, reason: event.target.value } : current)} /></TableCell><TableCell>—</TableCell><TableCell><Button size="sm" disabled={pending || !draft.teamId} onClick={() => void assign()}>Thêm</Button></TableCell><TableCell><IconButton aria-label="Bỏ hàng mới" icon={<TrashIcon className="size-4" />} onClick={() => setDraft(null)} /></TableCell></TableRow> : null}
            </TableBody></Table>{!draft ? <div className="group flex h-10 items-center justify-center border-t border-[#eeeeee]" onMouseEnter={() => undefined}><button type="button" aria-label="Thêm team nhận card" className="grid size-7 scale-90 place-items-center rounded-full bg-[#fff0f0] text-[#de3336] opacity-0 transition group-hover:scale-100 group-hover:opacity-100" onClick={() => setDraft({ teamId: '', teamName: '', reason: '' })}><PlusIcon className="size-4" /></button></div> : null}</div></div>
        </div>
      </Drawer>
      <Modal open={Boolean(deleteTarget)} title="Xác nhận xóa card" onClose={() => setDeleteTarget(null)} footer={<><Button variant="secondary" onClick={() => setDeleteTarget(null)}>Hủy</Button><Button variant="danger" disabled={!deleteReason.trim() || pending} onClick={() => void confirmDelete()}>Xóa card</Button></>}>
        <p className="mb-4 text-sm text-[#525252]">Card của team <strong>{deleteTarget?.teamName}</strong> chưa sử dụng và có thể xóa. Hãy nhập lý do để lưu lịch sử.</p><Input label="Lý do xóa" requiredMark value={deleteReason} onChange={(event) => setDeleteReason(event.target.value)} />
      </Modal>
    </>
  )
}
