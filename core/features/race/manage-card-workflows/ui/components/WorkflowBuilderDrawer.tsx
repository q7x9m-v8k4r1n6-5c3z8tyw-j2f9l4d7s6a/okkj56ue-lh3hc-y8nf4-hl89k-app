import { useMemo, useState } from 'react'
import { useEdgesState, useNodesState, type Edge } from '@xyflow/react'
import { PlayCircleIcon, SaveIcon, TrashIcon } from '@/core/assets'
import {
  Badge, Button, Drawer, Table, TableBody, TableCell, TableHead,
  TableHeaderCell, TableRow, formatGmt7DateTime, useToast,
} from '@/core/shared'
import type { RaceCardTeam } from '../../api/functionCard.api'
import { defaultTriggerForCard, type FunctionCard } from '../../model/mockCards'
import {
  createTriggerNode,
  mapBuilderToDefinition,
  mapWorkflowToBuilder,
  type BuilderNode,
  type WorkflowPaletteItem,
} from '../../model/workflow.builder'
import type {
  Workflow,
  WorkflowCatalogItem,
  WorkflowExecution,
} from '../../model/workflow.contract'
import { useWorkflowMutations, useWorkflowRuns } from '../../model/server/useCardWorkflows'
import { WorkflowActionPalette } from './WorkflowActionPalette'
import { CardUsageDesigner } from './CardUsageDesigner'
import { WorkflowCanvas } from './WorkflowCanvas'
import { WorkflowNodeConfigPanel } from './WorkflowNodeConfigPanel'

type Props = {
  open: boolean
  raceId: string
  card: FunctionCard | null
  workflow: Workflow | null
  catalog: WorkflowCatalogItem[]
  teams: RaceCardTeam[]
  onUpdateCard: (card: FunctionCard) => Promise<FunctionCard>
  onUploadBackground: (file: File) => Promise<string>
  onClose: () => void
}

const errorMessage = (error: unknown) => error instanceof Error
  ? error.message
  : 'Không thể thực hiện thao tác. Vui lòng thử lại.'

const runStatus = (status: 'running' | 'succeeded' | 'failed' | 'canceled', isSimulation: boolean) => {
  if (status === 'canceled') return { label: 'Cancel', variant: 'neutral' as const }
  if (status === 'running') return { label: 'Đang chạy', variant: 'warning' as const }
  if (isSimulation) return status === 'succeeded'
    ? { label: 'Test succeeded', variant: 'success' as const }
    : { label: 'Test failed', variant: 'danger' as const }
  return status === 'succeeded'
    ? { label: 'Succeeded', variant: 'success' as const }
    : { label: 'Failed', variant: 'danger' as const }
}

type SessionProps = Omit<Props, 'card'> & {
  card: FunctionCard
}

const WorkflowBuilderSession = ({ card, catalog, onClose, onUpdateCard, onUploadBackground, open, raceId, teams, workflow }: SessionProps) => {
  const { toast } = useToast()
  const mutations = useWorkflowMutations(raceId)
  const [workingWorkflow, setWorkingWorkflow] = useState<Workflow | null>(workflow)
  const runsQuery = useWorkflowRuns(workingWorkflow?.id)
  const [workingCard, setWorkingCard] = useState(card)
  const [activeTab, setActiveTab] = useState<'workflow' | 'usage' | 'runs'>('workflow')
  const triggerType = defaultTriggerForCard(workingCard.category)
  const [name, setName] = useState(workflow?.name ?? `${card.name} — ${triggerType === 'attacked' ? 'Khi bị tấn công' : 'Kích hoạt'}`)
  const [editingName, setEditingName] = useState(false)
  const [description, setDescription] = useState(workflow?.description ?? card.description)
  const inputPaletteItems = useMemo<WorkflowPaletteItem[]>(() => workingCard.inputs.map((input) => ({
    paletteKey: `input:${input.id}`,
    type: 'input.read_value',
    category: 'input',
    label: `Đọc: ${input.label}`,
    description: `Đọc giá trị người chơi nhập tại ô “${input.label}” và lưu vào biến workflow.`,
    isTrigger: false,
    defaultConfig: {
      inputKey: input.key,
      variableName: input.key,
    },
  })), [workingCard.inputs])
  const paletteItems = useMemo<WorkflowPaletteItem[]>(
    () => [...catalog, ...inputPaletteItems],
    [catalog, inputPaletteItems],
  )
  const mappedBuilder = workflow ? mapWorkflowToBuilder(workflow, paletteItems) : null
  const expectedTriggerNode = createTriggerNode(triggerType, paletteItems)
  const initialBuilder = mappedBuilder
    ? {
      ...mappedBuilder,
      nodes: mappedBuilder.nodes.map((node) => node.data.workflowType.startsWith('trigger.')
        ? { ...node, data: expectedTriggerNode.data }
        : node),
    }
    : { nodes: [expectedTriggerNode], edges: [] }
  const [nodes, setNodes, onNodesChange] = useNodesState<BuilderNode>(initialBuilder.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialBuilder.edges)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [simulation, setSimulation] = useState<WorkflowExecution | null>(null)

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId),
    [nodes, selectedNodeId],
  )
  const variableNames = useMemo(() => {
    const selectedIndex = nodes.findIndex((node) => node.id === selectedNodeId)
    const precedingNodes = selectedIndex < 0 ? nodes : nodes.slice(0, selectedIndex)
    return [...new Set(precedingNodes
      .filter((node) => node.data.workflowType === 'data.create_variable')
      .map((node) => String(node.data.config.name ?? '').trim())
      .filter(Boolean))]
  }, [nodes, selectedNodeId])
  const visibleRuns = useMemo(
    () => (runsQuery.data ?? []).filter((run) => workingCard.category !== 'defense' || !run.isSimulation),
    [runsQuery.data, workingCard.category],
  )
  const pending = mutations.save.isPending ||
    mutations.remove.isPending || mutations.simulate.isPending

  const changeWorkingCard = (nextCard: FunctionCard) => {
    const nextTriggerType = defaultTriggerForCard(nextCard.category)
    if (nextTriggerType !== triggerType) {
      const expected = createTriggerNode(nextTriggerType, catalog)
      setNodes((current) => current.map((node) => node.data.workflowType.startsWith('trigger.')
        ? { ...node, data: expected.data }
        : node))
    }
    setWorkingCard(nextCard)
  }

  const saveCurrent = async () => {
    if (!name.trim()) throw new Error('Tên workflow không được để trống.')
    if (!workingCard.name.trim()) throw new Error('Tên thẻ chức năng không được để trống.')
    const inputKeys = new Set(workingCard.inputs.map((input) => input.key))
    const missingInput = nodes.find((node) => node.data.workflowType === 'input.read_value' && !inputKeys.has(String(node.data.config.inputKey ?? '')))
    if (missingInput) throw new Error(`Action “${missingInput.data.label}” đang tham chiếu input không còn tồn tại.`)
    const createdVariables = new Set<string>()
    for (const node of nodes) {
      if (!node.data.workflowType.startsWith('trigger.') && !node.data.label.trim()) {
        throw new Error(`Action “${node.data.actionName}” cần có tiêu đề.`)
      }
      if (node.data.workflowType === 'data.create_variable') {
        const variableName = String(node.data.config.name ?? '').trim()
        if (!variableName) throw new Error('Action “Tạo biến” cần có tên biến.')
        if (createdVariables.has(variableName)) throw new Error(`Biến “${variableName}” đã được tạo trước đó.`)
        createdVariables.add(variableName)
      }
      if (node.data.workflowType === 'data.set_variable') {
        const variableName = String(node.data.config.name ?? '').trim()
        if (!createdVariables.has(variableName)) throw new Error('Action “Gán biến” phải chọn một biến đã được tạo trước đó.')
      }
      if (node.data.workflowType === 'attack.execute' && !node.data.config.subAction) {
        throw new Error('Action “Tấn công” cần chọn sub-action bằng dấu + trên node.')
      }
    }
    const savedCard = await onUpdateCard(workingCard)
    setWorkingCard(savedCard)
    const saved = await mutations.save.mutateAsync({
      workflowId: workingWorkflow?.id,
      request: {
        cardId: savedCard.id,
        name: name.trim(),
        description: description.trim(),
        triggerType,
        definition: mapBuilderToDefinition(nodes, edges),
        expectedModifiedAt: workingWorkflow?.modifiedAt,
      },
    })
    setWorkingWorkflow(saved)
    return saved
  }

  const save = async () => {
    try {
      await saveCurrent()
      toast({ title: 'Đã lưu workflow', description: 'Workflow đã hoạt động và team có thể sử dụng thẻ.' })
    } catch (error) {
      toast({ title: 'Không thể lưu workflow', description: errorMessage(error), variant: 'danger' })
    }
  }

  const simulate = async () => {
    try {
      const saved = await saveCurrent()
      const result = await mutations.simulate.mutateAsync({
        workflowId: saved.id,
        actorTeamId: '11111111-1111-1111-1111-111111111111',
        targetTeamId: '22222222-2222-2222-2222-222222222222',
      })
      setSimulation(result)
      toast({ title: 'Mô phỏng thành công', description: `Đã chạy ${result.trace.length} bước, không ghi thay đổi nghiệp vụ.` })
    } catch (error) {
      toast({ title: 'Mô phỏng thất bại', description: errorMessage(error), variant: 'danger' })
    }
  }

  const remove = async () => {
    if (!workingWorkflow || !window.confirm('Xóa workflow này? Lịch sử chạy vẫn được giữ trong database.')) return
    try {
      await mutations.remove.mutateAsync(workingWorkflow.id)
      toast({ title: 'Đã xóa workflow', description: 'Card có thể tạo workflow mới cho trigger này.' })
      onClose()
    } catch (error) {
      toast({ title: 'Không thể xóa workflow', description: errorMessage(error), variant: 'danger' })
    }
  }

  return (
    <Drawer
      open={open}
      title={editingName ? (
        <input
          autoFocus
          aria-label="Tên workflow"
          className="h-10 min-w-[320px] rounded-lg border border-[#dedede] px-3 text-lg font-semibold outline-none focus:border-[#de3336]"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onBlur={() => setEditingName(false)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') setEditingName(false)
            if (event.key === 'Escape') {
              event.stopPropagation()
              setEditingName(false)
            }
          }}
        />
      ) : (
        <button type="button" className="min-w-0 truncate rounded px-1 text-left hover:bg-[#f7f7f7]" title="Bấm để sửa tên workflow" onClick={() => setEditingName(true)}>
          {name || 'Workflow chưa đặt tên'}
        </button>
      )}
      panelClassName="!max-w-none !border-l-0 !pl-0"
      contentClassName="!overflow-hidden !p-0"
      onClose={pending ? () => undefined : onClose}
      footer={(
        <div className="flex w-full items-center justify-between gap-3">
          <div>
            {workingWorkflow && (
              <Button variant="danger" disabled={pending} leadingIcon={<TrashIcon className="size-4" />} onClick={() => void remove()}>Xóa</Button>
            )}
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary" disabled={pending} onClick={onClose}>Đóng</Button>
            {workingCard.category !== 'defense' && (
              <Button variant="secondary" disabled={pending} leadingIcon={<PlayCircleIcon className="size-4" />} onClick={() => void simulate()}>Mô phỏng</Button>
            )}
            <Button disabled={pending} leadingIcon={<SaveIcon className="size-4" />} onClick={() => void save()}>Lưu</Button>
          </div>
        </div>
      )}
    >
      <div className="flex h-full min-h-0 flex-col overflow-hidden border border-[#eeeeee]">
        <div className="flex shrink-0 items-center gap-1 border-b border-[#eeeeee] bg-white px-4 pt-2">
          <button type="button" className={`border-b-2 px-4 py-3 text-sm font-semibold ${activeTab === 'workflow' ? 'border-[#de3336] text-[#b02528]' : 'border-transparent text-[#737373]'}`} onClick={() => setActiveTab('workflow')}>Workflow</button>
          <button type="button" className={`border-b-2 px-4 py-3 text-sm font-semibold ${activeTab === 'usage' ? 'border-[#de3336] text-[#b02528]' : 'border-transparent text-[#737373]'}`} onClick={() => setActiveTab('usage')}>Giao diện sử dụng thẻ</button>
          <button type="button" className={`border-b-2 px-4 py-3 text-sm font-semibold ${activeTab === 'runs' ? 'border-[#de3336] text-[#b02528]' : 'border-transparent text-[#737373]'}`} onClick={() => setActiveTab('runs')}>Flow runs</button>
        </div>

        {activeTab === 'workflow' ? (
          <>
            <div className="shrink-0 border-b border-[#eeeeee] bg-white p-4">
              <label>
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#737373]">Mô tả</span>
                <input className="h-10 w-full rounded-lg border border-[#dedede] px-3 text-sm outline-none focus:border-[#de3336]" value={description} onChange={(event) => setDescription(event.target.value)} />
              </label>
            </div>

            <div className={`grid min-h-0 flex-1 overflow-hidden ${selectedNode ? 'grid-cols-[220px_minmax(480px,1fr)_290px]' : 'grid-cols-[220px_minmax(480px,1fr)]'}`}>
              <WorkflowActionPalette items={paletteItems} />
              <div className="relative min-h-0">
                <WorkflowCanvas
                  nodes={nodes}
                  edges={edges}
                  catalog={paletteItems}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  setNodes={setNodes}
                  setEdges={setEdges}
                  onSelectNode={setSelectedNodeId}
                />
                {simulation && (
                  <div className="absolute inset-x-4 bottom-4 z-10 max-h-40 overflow-y-auto rounded-xl border border-[#bbf7d0] bg-white/95 p-3 shadow-lg backdrop-blur">
                    <div className="mb-2 flex items-center justify-between">
                      <strong className="text-xs text-[#166534]">Kết quả mô phỏng · {simulation.trace.length} bước</strong>
                      <button className="text-xs text-[#737373]" onClick={() => setSimulation(null)}>Đóng</button>
                    </div>
                    <ol className="space-y-1 text-[11px] text-[#525252]">
                      {simulation.trace.map((item, index) => <li key={`${item.nodeId}-${index}`}>{index + 1}. {item.detail}</li>)}
                    </ol>
                  </div>
                )}
              </div>
              {selectedNode && (
                <WorkflowNodeConfigPanel
                  node={selectedNode}
                  teams={teams}
                  variableNames={variableNames}
                  onTitleChange={(title) => setNodes((current) => current.map((node) => node.id === selectedNodeId
                    ? { ...node, data: { ...node.data, label: title, config: { ...node.data.config, title } } }
                    : node))}
                  onChange={(config) => setNodes((current) => current.map((node) => node.id === selectedNodeId
                    ? { ...node, data: { ...node.data, config } }
                    : node))}
                  onDelete={() => {
                    if (!selectedNodeId || selectedNodeId === 'trigger') return
                    setNodes((current) => current.filter((node) => node.id !== selectedNodeId))
                    setEdges((current) => current.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId))
                    setSelectedNodeId(null)
                  }}
                />
              )}
            </div>
          </>
        ) : activeTab === 'usage' ? (
          <CardUsageDesigner card={workingCard} onChange={changeWorkingCard} onUploadBackground={onUploadBackground} />
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto bg-[#f7f7f7] p-6">
            <div className="overflow-hidden rounded-xl border border-[#eeeeee] bg-white">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Thời gian chạy</TableHeaderCell>
                    <TableHeaderCell>Thời gian kết thúc</TableHeaderCell>
                    <TableHeaderCell>Trạng thái</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleRuns.map((run) => {
                    const status = runStatus(run.status, run.isSimulation)
                    return (
                      <TableRow key={run.id}>
                        <TableCell>{formatGmt7DateTime(run.startedAt)}</TableCell>
                        <TableCell>{run.completedAt ? formatGmt7DateTime(run.completedAt) : '—'}</TableCell>
                        <TableCell><Badge variant={status.variant}>{status.label}</Badge></TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              {!workingWorkflow && <p className="border-t border-[#eeeeee] px-6 py-8 text-center text-sm text-[#737373]">Hãy lưu workflow để bắt đầu ghi nhận flow runs.</p>}
              {workingWorkflow && runsQuery.isLoading && <p className="border-t border-[#eeeeee] px-6 py-4 text-sm text-[#737373]">Đang tải flow runs...</p>}
              {workingWorkflow && !runsQuery.isLoading && !visibleRuns.length && <p className="border-t border-[#eeeeee] px-6 py-8 text-center text-sm text-[#737373]">Workflow chưa có lần chạy nào.</p>}
              {runsQuery.isError && <p className="border-t border-[#fee2e2] bg-[#fff7f7] px-6 py-4 text-sm text-[#b91c1c]">Không thể tải lịch sử flow runs.</p>}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  )
}

export const WorkflowBuilderDrawer = ({ card, ...props }: Props) => {
  if (!card) return null
  return (
    <WorkflowBuilderSession
      key={`${card.key}:${props.workflow?.id ?? 'new'}`}
      {...props}
      card={card}
    />
  )
}
