import { z } from 'zod'

export const triggerTypeSchema = z.enum(['activated', 'attacked'])
export const workflowStatusSchema = z.enum(['draft', 'published', 'disabled'])

const positionSchema = z.object({ x: z.number(), y: z.number() })
const configSchema = z.record(z.string(), z.unknown())

export const workflowNodeSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  position: positionSchema,
  config: configSchema,
})

export const workflowEdgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  sourceHandle: z.string().nullish(),
})

export const workflowDefinitionSchema = z.object({
  schemaVersion: z.literal(1),
  nodes: z.array(workflowNodeSchema),
  edges: z.array(workflowEdgeSchema),
})

export const workflowSchema = z.object({
  id: z.string().uuid(),
  cardId: z.string().uuid(),
  raceId: z.string().uuid(),
  cardKey: z.string(),
  cardName: z.string(),
  name: z.string(),
  description: z.string(),
  triggerType: triggerTypeSchema,
  status: workflowStatusSchema,
  version: z.number().int(),
  definition: workflowDefinitionSchema,
  createdAt: z.string(),
  modifiedAt: z.string(),
})

export const workflowCatalogItemSchema = z.object({
  type: z.string(),
  category: z.string(),
  label: z.string(),
  description: z.string(),
  isTrigger: z.boolean(),
  defaultConfig: configSchema,
})

export const workflowExecutionSchema = z.object({
  runId: z.string().uuid(),
  status: z.string(),
  isSimulation: z.boolean(),
  trace: z.array(z.object({
    nodeId: z.string(),
    nodeType: z.string(),
    status: z.string(),
    detail: z.string(),
  })),
  effects: z.array(z.object({
    type: z.string(),
    target: z.string(),
    data: z.unknown(),
    applied: z.boolean(),
  })),
  variables: configSchema,
})

export const workflowRunSchema = z.object({
  id: z.string().uuid(),
  workflowId: z.string().uuid(),
  status: z.enum(['running', 'succeeded', 'failed', 'canceled']),
  isSimulation: z.boolean(),
  eventId: z.string().nullable(),
  input: z.unknown(),
  output: z.unknown(),
  error: z.string().nullable(),
  startedAt: z.string(),
  completedAt: z.string().nullable(),
})

export type TriggerType = z.infer<typeof triggerTypeSchema>
export type WorkflowStatus = z.infer<typeof workflowStatusSchema>
export type WorkflowNode = z.infer<typeof workflowNodeSchema>
export type WorkflowEdge = z.infer<typeof workflowEdgeSchema>
export type WorkflowDefinition = z.infer<typeof workflowDefinitionSchema>
export type Workflow = z.infer<typeof workflowSchema>
export type WorkflowCatalogItem = z.infer<typeof workflowCatalogItemSchema>
export type WorkflowExecution = z.infer<typeof workflowExecutionSchema>
export type WorkflowRun = z.infer<typeof workflowRunSchema>

export type SaveWorkflowRequest = {
  cardId: string
  name: string
  description: string
  triggerType: TriggerType
  definition: WorkflowDefinition
  expectedModifiedAt?: string
}
