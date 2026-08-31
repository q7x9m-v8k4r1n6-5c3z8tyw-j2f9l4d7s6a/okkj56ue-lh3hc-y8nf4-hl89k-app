import { z } from 'zod'

export const cardInputSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.string(),
  required: z.boolean(),
  description: z.string(),
})

export const cardSchema = z.object({
  cardId: z.string(),
  cardName: z.string(),
  description: z.string(),
  price: z.number(),
  remainingStock: z.number(),
  usage: z.string(),
  inputs: z.array(cardInputSchema),
  config: z.record(z.string(), z.string()),
})

export const storeOverviewSchema = z.object({
  storeOpen: z.boolean(),
  cards: z.array(cardSchema),
})

export const cardTeamSchema = z.object({
  teamId: z.string(),
  teamName: z.string(),
  cardId: z.string(),
  cardName: z.string(),
  receivedAt: z.string(),
  receiveReason: z.string(),
  usedAt: z.string().nullable(),
  status: z.enum(['received', 'used', 'deleted']),
  canDelete: z.boolean(),
  deletedAt: z.string().nullable(),
  deletedReason: z.string().nullable(),
  usageInputs: z.record(z.string(), z.string()),
})

export const teamCardSchema = z.object({
  cardId: z.string(),
  cardName: z.string(),
  description: z.string(),
  usage: z.string(),
  inputs: z.array(cardInputSchema),
  config: z.record(z.string(), z.string()),
  receivedAt: z.string(),
  receiveReason: z.string(),
  usedAt: z.string().nullable(),
  status: z.enum(['received', 'used', 'deleted']),
})

export const raceTeamsSchema = z.object({
  raceTeam: z.array(z.object({
    teamID: z.string().uuid(),
    name: z.string(),
  })).catch([]),
})

export type Card = z.infer<typeof cardSchema>
export type CardTeam = z.infer<typeof cardTeamSchema>
export type TeamCard = z.infer<typeof teamCardSchema>
