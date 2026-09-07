import { z } from 'zod'

export const cardIdSchema = z.enum([
  'OVERCLOCK',
  'CUPID',
  'ENGINEER',
  'ATHLETE',
  'REVIVE',
  'SWAP',
  'TRAP',
])

export const cardInputSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum(['opponent_team', 'booth', 'overclock_predictions']),
  required: z.boolean(),
  description: z.string(),
})

const jsonRecordSchema = z.record(z.string(), z.unknown())

export const cardUseHistorySchema = z.object({
  cardUseId: z.string().uuid(),
  effectId: z.string().nullable(),
  status: z.enum(['pending', 'active', 'resolved', 'failed']),
  inputs: jsonRecordSchema,
  usedAt: z.string(),
  endAt: z.string().nullable(),
  failureReason: z.string().nullable(),
  result: jsonRecordSchema.nullable(),
})

export const cardAvailabilitySchema = z.object({
  canUse: z.boolean(),
  reasonCode: z.enum([
    'available',
    'used',
    'disabled',
    'pending_confirmation',
    'effect_active',
    'cooldown',
    'wrong_game_phase',
    'not_between_booths',
    'not_in_booth',
    'backend_not_ready',
    'overclock_closed',
  ]),
  reason: z.string(),
  nextTimeAvailable: z.string().nullable(),
})

export const cardSchema = z.object({
  cardId: cardIdSchema,
  cardName: z.string(),
  cardType: z.enum(['core_chip', 'data_patch']),
  description: z.string(),
  price: z.number(),
  remainingStock: z.number().int(),
  usage: z.string(),
  inputs: z.array(cardInputSchema),
  config: jsonRecordSchema,
})

export const storeOverviewSchema = z.object({
  cards: z.array(cardSchema),
})

export const overclockWindowSchema = z.object({
  status: z.enum(['not_opened', 'open', 'closed', 'resolved']),
  openedAt: z.string().nullable(),
  openedBy: z.string().nullable(),
  closedAt: z.string().nullable(),
  closedBy: z.string().nullable(),
  resolvedAt: z.string().nullable(),
  resolutionEventId: z.string().nullable(),
})

export const overclockResolutionSchema = z.object({
  status: z.enum(['closed', 'resolved']),
  predictionCount: z.number().int(),
  correctCount: z.number().int(),
  incorrectCount: z.number().int(),
  notEvaluatedCount: z.number().int(),
})

export const cardTeamSchema = z.object({
  teamId: z.string().uuid(),
  teamName: z.string(),
  cardInstanceId: z.string().uuid(),
  cardId: cardIdSchema,
  cardName: z.string(),
  cardType: z.enum(['core_chip', 'data_patch']),
  cardUseCountRemain: z.number().int(),
  receivedAt: z.string(),
  receiveReason: z.string(),
  status: z.enum(['received', 'used', 'deleted']),
  canDelete: z.boolean(),
  disabledAt: z.string().nullable(),
  disabledReason: z.string().nullable(),
  cardUses: z.array(cardUseHistorySchema),
})

export const teamCardSchema = z.object({
  cardInstanceId: z.string().uuid(),
  cardId: cardIdSchema,
  cardName: z.string(),
  cardType: z.enum(['core_chip', 'data_patch']),
  description: z.string(),
  usage: z.string(),
  inputs: z.array(cardInputSchema),
  config: jsonRecordSchema,
  cardUseCountRemain: z.number().int(),
  receivedAt: z.string(),
  receiveReason: z.string(),
  status: z.enum(['received', 'used', 'deleted']),
  availability: cardAvailabilitySchema,
  cardUses: z.array(cardUseHistorySchema),
})

export const cardUseResponseSchema = z.object({
  cardUseId: z.string().uuid(),
  effectId: z.string().nullable(),
  cardInstanceId: z.string().uuid(),
  cardId: cardIdSchema,
  cardName: z.string(),
  status: z.enum(['pending', 'active', 'resolved', 'failed']),
  usedAt: z.string(),
  endAt: z.string().nullable(),
  message: z.string(),
})

export const raceOptionsSchema = z.object({
  raceTeam: z.array(z.object({
    teamID: z.string().uuid(),
    name: z.string(),
  })).catch([]),
  booth: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    type: z.enum(['other', 'intellectual', 'physical']).catch('other'),
    maximumScore: z.number().int().nullable().optional(),
  })).catch([]),
})

export type Card = z.infer<typeof cardSchema>
export type CardTeam = z.infer<typeof cardTeamSchema>
export type TeamCard = z.infer<typeof teamCardSchema>
export type CardUseResponse = z.infer<typeof cardUseResponseSchema>
export type RaceOptions = z.infer<typeof raceOptionsSchema>
