import { client } from '@/core/shared'
import {
  workflowCatalogItemSchema,
  workflowExecutionSchema,
  workflowRunSchema,
  workflowSchema,
  type SaveWorkflowRequest,
  type Workflow,
  type WorkflowCatalogItem,
  type WorkflowExecution,
} from '../model/workflow.contract'

const requiredCatalogItems: WorkflowCatalogItem[] = [
  {
    type: 'data.create_variable',
    category: 'data',
    label: 'Tạo biến',
    description: 'Khởi tạo một biến để các action phía sau sử dụng.',
    isTrigger: false,
    defaultConfig: { name: 'bienMoi', value: { kind: 'literal', value: '' } },
  },
  {
    type: 'flow.scope',
    category: 'flow',
    label: 'Scope Try/Catch',
    description: 'Chạy nhánh Try và chuyển sang nhánh Catch nếu một action phát sinh lỗi.',
    isTrigger: false,
    defaultConfig: {},
  },
  {
    type: 'attack.execute',
    category: 'attack',
    label: 'Tấn công',
    description: 'Chọn một sub-action tấn công trước khi nối sang bước tiếp theo.',
    isTrigger: false,
    defaultConfig: { subAction: '', amount: 10, durationSeconds: 60, defenseTags: [] },
  },
]

export const getWorkflows = async (raceId: string, signal?: AbortSignal) => {
  const response = await client.request<unknown>({
    path: '/workflows',
    query: { raceId },
    signal,
  })
  return workflowSchema.array().parse(response)
}

export const getWorkflowCatalog = async (signal?: AbortSignal) => {
  const response = await client.request<unknown>({ path: '/workflows/catalog', signal })
  const catalog = workflowCatalogItemSchema.array().parse(response)
    .filter((item) => item.type !== 'card.apply_effect')
    .map((item) => item.type === 'team.adjust_score'
      ? {
          ...item,
          label: 'Cộng điểm',
          description: 'Cộng một số điểm dương cho đội được chọn.',
          defaultConfig: { ...item.defaultConfig, delta: Math.max(1, Math.abs(Number(item.defaultConfig.delta) || 10)) },
        }
      : item)
  return [
    ...catalog,
    ...requiredCatalogItems.filter((required) => !catalog.some((item) => item.type === required.type)),
  ]
}

export const createWorkflow = async (
  raceId: string,
  request: SaveWorkflowRequest,
): Promise<Workflow> => {
  const response = await client.request<unknown, SaveWorkflowRequest>({
    path: `/workflows/races/${raceId}`,
    method: 'POST',
    body: request,
  })
  return workflowSchema.parse(response)
}

export const updateWorkflow = async (
  workflowId: string,
  request: SaveWorkflowRequest,
): Promise<Workflow> => {
  const response = await client.request<unknown, SaveWorkflowRequest>({
    path: `/workflows/${workflowId}`,
    method: 'PUT',
    body: request,
  })
  return workflowSchema.parse(response)
}

export const changeWorkflowStatus = async (
  workflowId: string,
  status: 'draft' | 'published' | 'disabled',
  expectedModifiedAt: string,
): Promise<Workflow> => {
  const response = await client.request<unknown>({
    path: `/workflows/${workflowId}/status`,
    method: 'PUT',
    body: { status, expectedModifiedAt },
  })
  return workflowSchema.parse(response)
}

export const deleteWorkflow = async (workflowId: string) => {
  await client.request<boolean>({ path: `/workflows/${workflowId}`, method: 'DELETE' })
}

export const simulateWorkflow = async (
  workflowId: string,
  actorTeamId?: string,
  targetTeamId?: string,
): Promise<WorkflowExecution> => {
  const response = await client.request<unknown>({
    path: `/workflows/${workflowId}/execute`,
    method: 'POST',
    body: {
      isSimulation: true,
      actorTeamId: actorTeamId || null,
      targetTeamId: targetTeamId || null,
      variables: {},
      payload: {},
    },
  })
  return workflowExecutionSchema.parse(response)
}

export const getWorkflowRuns = async (
  workflowId: string,
  signal?: AbortSignal,
) => {
  const response = await client.request<unknown>({
    path: `/workflows/${workflowId}/runs`,
    query: { limit: 100 },
    signal,
  })
  return workflowRunSchema.array().parse(response)
}
