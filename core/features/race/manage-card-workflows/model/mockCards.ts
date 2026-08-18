import { z } from 'zod'
import type { TriggerType } from './workflow.contract'

export const cardCategorySchema = z.enum(['attack', 'defense', 'effect'])
export const cardInputTypeSchema = z.enum([
  'text',
  'textarea',
  'number',
  'select',
  'multiselect',
  'checkbox',
])

const cardOptionSchema = z.object({ id: z.string(), label: z.string(), value: z.string() })
export const cardOptionSourceSchema = z.enum(['custom', 'teams', 'cards'])

const legacyBackendSourceSchema = z.object({
  entity: z.string(),
}).passthrough()

export const cardInputSchema = z.object({
  id: z.string(),
  key: z.string(),
  label: z.string(),
  type: cardInputTypeSchema,
  required: z.boolean(),
  placeholder: z.string(),
  optionSource: z.enum(['custom', 'teams', 'cards', 'manual', 'backend']),
  options: z.array(cardOptionSchema),
  backendSource: legacyBackendSourceSchema.optional(),
}).transform(({ backendSource, optionSource, ...input }) => ({
  ...input,
  optionSource: optionSource === 'manual'
    ? 'custom' as const
    : optionSource === 'backend'
      ? (backendSource?.entity === 'teams' ? 'teams' as const : 'custom' as const)
      : optionSource,
}))

export const functionCardSchema = z.object({
  id: z.string().uuid(),
  raceId: z.string().uuid(),
  teamId: z.string().uuid().nullable(),
  teamName: z.string().nullable(),
  cardKey: z.string(),
  name: z.string(),
  category: cardCategorySchema,
  description: z.string(),
  backgroundUrl: z.string().nullable().transform((value) => value ?? ''),
  inputs: z.array(cardInputSchema),
  workflowId: z.string().uuid().nullable(),
  workflowName: z.string().nullable(),
  workflowStatus: z.enum(['draft', 'published', 'disabled']).nullable(),
  createdAt: z.string(),
  modifiedAt: z.string(),
}).transform(({ cardKey, ...card }) => ({ ...card, key: cardKey }))

export type CardCategory = z.infer<typeof cardCategorySchema>
export type CardInputType = z.infer<typeof cardInputTypeSchema>
export type CardOptionSource = z.infer<typeof cardOptionSourceSchema>
export type CardInputDefinition = z.infer<typeof cardInputSchema>
export type FunctionCard = z.infer<typeof functionCardSchema>

export type SaveFunctionCardRequest = {
  cardKey: string
  name: string
  description: string
  category: CardCategory
  backgroundUrl: string | null
  inputs: CardInputDefinition[]
  expectedModifiedAt?: string
}

export const cardCategoryLabels: Record<CardCategory, string> = {
  attack: 'Tấn công',
  defense: 'Phòng thủ',
  effect: 'Hiệu ứng',
}

export const defaultTriggerForCard = (category: CardCategory): TriggerType =>
  category === 'defense' ? 'attacked' : 'activated'

export const createEmptyCardInput = (type: CardInputType = 'text'): CardInputDefinition => ({
  id: crypto.randomUUID(),
  key: `input_${crypto.randomUUID().slice(0, 8)}`,
  label: 'Trường mới',
  type,
  required: false,
  placeholder: '',
  optionSource: 'custom',
  options: [],
})

export const createFunctionCardKey = (name: string) => {
  const slug = name.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `${slug || 'card'}-${crypto.randomUUID().slice(0, 8)}`
}
