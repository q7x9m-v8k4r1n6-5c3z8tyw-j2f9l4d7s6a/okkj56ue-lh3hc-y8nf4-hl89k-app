import { z } from 'zod'
import { client } from '@/core/shared/api'
import {
  cardTeamSchema,
  raceTeamsSchema,
  storeOverviewSchema,
  teamCardSchema,
  type Card,
  type CardTeam,
  type TeamCard,
} from '../model/card.contract'

const pluginPath = '/plugin/cards'

export const getCardStore = async (raceId: string, signal?: AbortSignal) =>
  storeOverviewSchema.parse(await client.request<unknown>({
    path: `${pluginPath}/races/${raceId}`,
    signal,
  }))

export const getCardTeams = async (raceId: string, cardId: string, signal?: AbortSignal): Promise<CardTeam[]> =>
  cardTeamSchema.array().parse(await client.request<unknown>({
    path: `${pluginPath}/races/${raceId}/cards/${cardId}/teams`,
    signal,
  }))

export const getRaceTeams = async (raceId: string, signal?: AbortSignal) => {
  const response = raceTeamsSchema.parse(await client.request<unknown>({
    path: `/Race/${raceId}`,
    signal,
  }))
  return response.raceTeam.map((team) => ({ id: team.teamID, name: team.name }))
}

export const setStoreOpen = async (raceId: string, open: boolean) => {
  await client.request<boolean>({
    path: `${pluginPath}/races/${raceId}/store/${open ? 'open' : 'close'}`,
    method: 'POST',
  })
}

export const restockCards = async (raceId: string, quantities: Record<string, number>) => {
  await client.request<boolean>({
    path: `${pluginPath}/races/${raceId}/inventory/restock`,
    method: 'POST',
    body: { quantities },
  })
}

export const scheduleRestock = async (raceId: string, scheduledAt: string, quantities: Record<string, number>) => {
  await client.request<boolean>({
    path: `${pluginPath}/races/${raceId}/inventory/schedule`,
    method: 'POST',
    body: { scheduledAt, quantities },
  })
}

export const updateCardConfig = async (raceId: string, cardId: string, config: Record<string, string>) => {
  await client.request<boolean>({
    path: `${pluginPath}/races/${raceId}/cards/${cardId}/config`,
    method: 'PUT',
    body: { config },
  })
}

export const assignCard = async (
  raceId: string,
  cardId: string,
  request: { teamId: string; teamName: string; reason: string },
) => cardTeamSchema.parse(await client.request<unknown>({
  path: `${pluginPath}/races/${raceId}/cards/${cardId}/teams`,
  method: 'POST',
  body: request,
}))

export const deleteCardAssignment = async (raceId: string, cardId: string, teamId: string, reason: string) => {
  await client.request<boolean>({
    path: `${pluginPath}/races/${raceId}/cards/${cardId}/teams/${teamId}`,
    method: 'DELETE',
    body: { reason },
  })
}

export const getTeamCards = async (raceId: string, signal?: AbortSignal): Promise<TeamCard[]> =>
  teamCardSchema.array().parse(await client.request<unknown>({
    path: `${pluginPath}/team/races/${raceId}/cards`,
    signal,
  }))

export const getTeamCard = async (raceId: string, cardId: string, signal?: AbortSignal) =>
  teamCardSchema.parse(await client.request<unknown>({
    path: `${pluginPath}/team/races/${raceId}/cards/${cardId}`,
    signal,
  }))

export const useTeamCard = async (raceId: string, cardId: string, inputs: Record<string, string>) =>
  z.object({ cardId: z.string(), cardName: z.string(), status: z.string(), usedAt: z.string(), message: z.string() }).parse(
    await client.request<unknown>({
      path: `${pluginPath}/team/races/${raceId}/cards/${cardId}/use`,
      method: 'POST',
      body: { inputs },
    }),
  )

export type { Card }
