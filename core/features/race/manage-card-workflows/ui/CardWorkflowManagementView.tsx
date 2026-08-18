import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CardMembershipIcon, EditIcon, PlusIcon, TrashIcon } from '@/core/assets'
import {
  Badge, Button, IconButton, Table, TableBody, TableCard, TableCell,
  TableHead, TableHeaderCell, TableRow, useToast,
} from '@/core/shared'
import {
  cardCategoryLabels, type FunctionCard,
  type SaveFunctionCardRequest,
} from '../model/mockCards'
import { useFunctionCardMutations, useFunctionCards, useFunctionCardTeams } from '../model/server/useFunctionCards'
import type { TriggerType, Workflow } from '../model/workflow.contract'
import { useCardWorkflows, useWorkflowCatalog } from '../model/server/useCardWorkflows'
import { FunctionCardDrawer } from './components/FunctionCardDrawer'
import { WorkflowBuilderDrawer } from './components/WorkflowBuilderDrawer'

const triggerLabels: Record<TriggerType, string> = {
  activated: 'Kích hoạt',
  attacked: 'Khi bị tấn công',
}

const statusLabels = {
  draft: 'Bản nháp',
  published: 'Đã xuất bản',
  disabled: 'Đã tắt',
} as const

const errorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error && 'message' in error && typeof error.message === 'string') return error.message
  return 'Không thể thực hiện thao tác. Vui lòng thử lại.'
}

const toSaveRequest = (card: FunctionCard): SaveFunctionCardRequest => ({
  cardKey: card.key,
  name: card.name,
  description: card.description,
  category: card.category,
  backgroundUrl: card.backgroundUrl || null,
  inputs: card.inputs,
  expectedModifiedAt: card.modifiedAt,
})

export const CardWorkflowManagementView = () => {
  const { raceId = '' } = useParams<{ raceId: string }>()
  const { toast } = useToast()
  const cardsQuery = useFunctionCards(raceId)
  const teamsQuery = useFunctionCardTeams(raceId)
  const cardMutations = useFunctionCardMutations(raceId)
  const workflowsQuery = useCardWorkflows(raceId)
  const catalogQuery = useWorkflowCatalog()
  const [cardDrawerOpen, setCardDrawerOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<FunctionCard | null>(null)
  const [selectedCard, setSelectedCard] = useState<FunctionCard | null>(null)
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)

  const workflowByCard = useMemo(() => {
    const grouped = new Map<string, Workflow>()
    for (const workflow of workflowsQuery.data ?? []) {
      if (!grouped.has(workflow.cardId)) grouped.set(workflow.cardId, workflow)
    }
    return grouped
  }, [workflowsQuery.data])

  const openCreateWorkflow = (card: FunctionCard) => {
    setSelectedCard(card)
    setSelectedWorkflow(null)
  }

  const openEditWorkflow = (card: FunctionCard, workflow: Workflow) => {
    setSelectedCard(card)
    setSelectedWorkflow(workflow)
  }

  const saveCardFromDrawer = async (
    request: SaveFunctionCardRequest,
    backgroundFile: File | null,
  ) => {
    const backgroundUrl = backgroundFile
      ? await cardMutations.uploadBackground.mutateAsync(backgroundFile)
      : request.backgroundUrl
    const nextRequest = { ...request, backgroundUrl }
    if (editingCard) {
      await cardMutations.update.mutateAsync({ cardId: editingCard.id, request: nextRequest })
      toast({ title: 'Đã cập nhật thẻ chức năng' })
    } else {
      await cardMutations.create.mutateAsync(nextRequest)
      toast({ title: 'Đã tạo thẻ chức năng', description: 'Thẻ chưa được gán cho team nào.' })
    }
  }

  const updateCard = async (card: FunctionCard) => cardMutations.update.mutateAsync({
    cardId: card.id,
    request: toSaveRequest(card),
  })

  const assignTeam = async (card: FunctionCard, teamId: string | null) => {
    try {
      await cardMutations.assignTeam.mutateAsync({
        cardId: card.id,
        teamId,
        expectedModifiedAt: card.modifiedAt,
      })
      toast({
        title: teamId ? 'Đã gán thẻ cho team' : 'Đã bỏ gán team',
        description: teamId ? 'Mỗi thẻ hiện chỉ thuộc một team.' : 'Thẻ trở về trạng thái chưa được gán.',
      })
    } catch (error) {
      toast({ title: 'Không thể cập nhật team', description: errorMessage(error), variant: 'danger' })
    }
  }

  const removeCard = async (card: FunctionCard) => {
    if (!window.confirm(`Xóa thẻ “${card.name}”? Workflow của thẻ cũng sẽ bị xóa.`)) return
    try {
      await cardMutations.remove.mutateAsync(card.id)
      toast({ title: 'Đã xóa thẻ chức năng' })
    } catch (error) {
      toast({ title: 'Không thể xóa thẻ', description: errorMessage(error), variant: 'danger' })
    }
  }

  const pending = cardMutations.assignTeam.isPending || cardMutations.remove.isPending

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CardMembershipIcon className="size-6 text-[#de3336]" />
            <h2 className="text-xl font-semibold text-[#262626]">Danh sách thẻ chức năng</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button leadingIcon={<PlusIcon className="size-4" />} onClick={() => { setEditingCard(null); setCardDrawerOpen(true) }}>Tạo thẻ chức năng</Button>
        </div>
      </header>

      <TableCard>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Thẻ chức năng</TableHeaderCell>
              <TableHeaderCell>Mô tả</TableHeaderCell>
              <TableHeaderCell>Loại</TableHeaderCell>
              <TableHeaderCell>Team sở hữu</TableHeaderCell>
              <TableHeaderCell>Workflow</TableHeaderCell>
              <TableHeaderCell>Trạng thái</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(cardsQuery.data ?? []).map((card) => {
              const workflow = workflowByCard.get(card.id)
              return (
                <TableRow key={card.id} className="last:border-b-0">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-[#801b1e] to-[#de3336]">
                        {card.backgroundUrl ? <img src={card.backgroundUrl} alt="" className="size-full object-cover" /> : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-[#262626]">{card.name}</div>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <IconButton aria-label={`Sửa ${card.name}`} icon={<EditIcon className="size-4" />} onClick={() => { setEditingCard(card); setCardDrawerOpen(true) }} />
                        <IconButton aria-label={`Xóa ${card.name}`} icon={<TrashIcon className="size-4" />} disabled={pending} onClick={() => void removeCard(card)} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="mt-1 max-w-md text-xs text-[#737373]">{card.description}</div>
                  </TableCell>
                  <TableCell><Badge>{cardCategoryLabels[card.category]}</Badge></TableCell>
                  <TableCell>
                    <select
                      aria-label={`Gán team cho ${card.name}`}
                      className="h-9 min-w-48 rounded-lg border border-[#dedede] bg-white px-3 text-xs outline-none focus:border-[#de3336]"
                      value={card.teamId ?? ''}
                      disabled={pending || teamsQuery.isLoading}
                      onChange={(event) => void assignTeam(card, event.target.value || null)}
                    >
                      <option value="">Chưa gán team</option>
                      {(teamsQuery.data ?? []).map((team) => <option key={team.id} value={team.id}>{team.name || team.email}</option>)}
                    </select>
                  </TableCell>
                  <TableCell>
                    {workflow ? (
                      <button type="button" className="rounded-lg border border-[#e5e5e5] bg-white px-2.5 py-1.5 text-left hover:border-[#de3336]/50" onClick={() => openEditWorkflow(card, workflow)}>
                        <span className="block text-xs font-medium text-[#333]">{workflow.name}</span>
                      </button>
                    ) : (
                      <Button size="sm" variant="secondary" disabled={catalogQuery.isLoading} leadingIcon={<PlusIcon className="size-4" />} onClick={() => openCreateWorkflow(card)}>Thêm workflow</Button>
                    )}
                  </TableCell>
                  <TableCell>
                    {workflow ? <Badge variant={workflow.status === 'published' ? 'success' : workflow.status === 'disabled' ? 'danger' : 'neutral'}>{statusLabels[workflow.status]}</Badge> : <span className="text-xs text-[#a3a3a3]">—</span>}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {(cardsQuery.isLoading || workflowsQuery.isLoading) && <p className="border-t border-[#eeeeee] px-6 py-4 text-sm text-[#737373]">Đang tải thẻ chức năng...</p>}
        {!cardsQuery.isLoading && !cardsQuery.isError && !(cardsQuery.data?.length) && <p className="border-t border-[#eeeeee] px-6 py-8 text-center text-sm text-[#737373]">Chưa có thẻ chức năng. Hãy tạo thẻ đầu tiên.</p>}
        {(cardsQuery.isError || workflowsQuery.isError) && <p className="border-t border-[#fee2e2] bg-[#fff7f7] px-6 py-4 text-sm text-[#b91c1c]">Không thể tải dữ liệu. Hãy kiểm tra backend và migration 007_FunctionCards.sql.</p>}
      </TableCard>

      <WorkflowBuilderDrawer
        open={Boolean(selectedCard)}
        raceId={raceId}
        card={selectedCard}
        workflow={selectedWorkflow}
        catalog={catalogQuery.data ?? []}
        teams={teamsQuery.data ?? []}
        onUpdateCard={updateCard}
        onUploadBackground={(file) => cardMutations.uploadBackground.mutateAsync(file)}
        onClose={() => { setSelectedCard(null); setSelectedWorkflow(null) }}
      />
      <FunctionCardDrawer
        key={`${editingCard?.id ?? 'new'}:${cardDrawerOpen}`}
        open={cardDrawerOpen}
        card={editingCard}
        onClose={() => setCardDrawerOpen(false)}
        onSave={saveCardFromDrawer}
      />
    </section>
  )
}
