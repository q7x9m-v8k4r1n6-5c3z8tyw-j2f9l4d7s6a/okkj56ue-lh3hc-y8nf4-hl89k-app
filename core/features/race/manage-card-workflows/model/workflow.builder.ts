import type { Edge, Node } from '@xyflow/react'
import type {
  TriggerType,
  Workflow,
  WorkflowCatalogItem,
  WorkflowDefinition,
} from './workflow.contract'

export type WorkflowNodeData = {
  workflowType: string
  label: string
  actionName: string
  description: string
  category: string
  config: Record<string, unknown>
  onAttackSubActionSelect?: (subAction: AttackSubAction) => void
  [key: string]: unknown
}

export type AttackSubAction = 'subtract' | 'freeze' | 'steal' | 'transfer'

export type BuilderNode = Node<WorkflowNodeData, 'workflow'>

export type WorkflowPaletteItem = WorkflowCatalogItem & {
  paletteKey?: string
}

export const triggerNodeType = (trigger: TriggerType) =>
  trigger === 'activated' ? 'trigger.activated' : 'trigger.attacked'

export const createTriggerNode = (
  trigger: TriggerType,
  catalog: WorkflowPaletteItem[],
): BuilderNode => {
  const type = triggerNodeType(trigger)
  const item = catalog.find((entry) => entry.type === type)
  return {
    id: 'trigger',
    type: 'workflow',
    position: { x: 80, y: 220 },
    data: {
      workflowType: type,
      label: item?.label ?? (trigger === 'activated' ? 'Kích hoạt' : 'Khi bị tấn công'),
      actionName: item?.label ?? (trigger === 'activated' ? 'Kích hoạt' : 'Khi bị tấn công'),
      description: item?.description ?? 'Trigger bắt đầu workflow.',
      category: 'trigger',
      config: {},
    },
  }
}

export const createBuilderNode = (
  item: WorkflowPaletteItem,
  position: { x: number; y: number },
): BuilderNode => ({
  id: `${item.type}-${crypto.randomUUID()}`,
  type: 'workflow',
  position,
  data: {
    workflowType: item.type,
    label: item.label,
    actionName: item.label,
    description: item.description,
    category: item.category,
    config: { ...structuredClone(item.defaultConfig), title: item.label },
  },
})

const findCatalogItem = (
  node: Workflow['definition']['nodes'][number],
  catalog: WorkflowPaletteItem[],
) => {
  if (node.type === 'input.read_value') {
    const inputKey = typeof node.config.inputKey === 'string' ? node.config.inputKey : ''
    return catalog.find((entry) => entry.type === node.type && entry.defaultConfig.inputKey === inputKey)
  }
  return catalog.find((entry) => entry.type === node.type)
}

export const mapWorkflowToBuilder = (
  workflow: Workflow,
  catalog: WorkflowPaletteItem[],
): { nodes: BuilderNode[]; edges: Edge[] } => ({
  nodes: workflow.definition.nodes.map((node) => {
    const item = findCatalogItem(node, catalog)
    const actionName = item?.label || node.type
    const title = typeof node.config.title === 'string' && node.config.title.trim()
      ? node.config.title.trim()
      : actionName
    return {
      id: node.id,
      type: 'workflow',
      position: node.position,
      data: {
        workflowType: node.type,
        label: title,
        actionName,
        description: item?.description ?? '',
        category: item?.category ?? 'action',
        config: node.config,
      },
    }
  }),
  edges: workflow.definition.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle ?? undefined,
    animated: true,
    style: { stroke: '#de3336', strokeWidth: 2 },
  })),
})

export const mapBuilderToDefinition = (
  nodes: BuilderNode[],
  edges: Edge[],
): WorkflowDefinition => ({
  schemaVersion: 1,
  nodes: nodes.map((node) => ({
    id: node.id,
    type: node.data.workflowType,
    position: node.position,
    config: node.data.config,
  })),
  edges: edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle ?? null,
  })),
})
