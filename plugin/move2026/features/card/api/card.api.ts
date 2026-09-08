import { client } from '@/core/shared/api'
import {
  cardPurchaseSchema,
  cardSchema,
  cardShopStateSchema,
  cardTeamSchema,
  cardUseResponseSchema,
  overclockResolutionSchema,
  overclockWindowSchema,
  pendingReviveSchema,
  raceOptionsSchema,
  storeOverviewSchema,
  teamCardShopSchema,
  teamCardSchema,
  type CardTeam,
  type TeamCard,
} from '../model/card.contract'

const pluginPath = '/plugin/cards'

export const getCardStore = async (raceId: string, signal?: AbortSignal) =>
  storeOverviewSchema.parse(await client.request<unknown>({
    path: `${pluginPath}/races/${raceId}`,
    signal,
  }))

export const getCardShopState = async (raceId: string, signal?: AbortSignal) =>
  cardShopStateSchema.parse(await client.request<unknown>({
    path: `${pluginPath}/races/${raceId}/shop`,
    signal,
  }))

export const setCardShopOpen = async (raceId: string, open: boolean) =>
  cardShopStateSchema.parse(await client.request<unknown>({
    path: `${pluginPath}/races/${raceId}/shop/${open ? 'open' : 'close'}`,
    method: 'POST',
  }))

export const updateCardShopPolicy = async (raceId: string, maxDataPatchPerTeam: number) =>
  cardShopStateSchema.parse(await client.request<unknown>({
    path: `${pluginPath}/races/${raceId}/shop/policy`,
    method: 'PUT',
    body: { maxDataPatchPerTeam },
  }))

export const updateCardPrice = async (raceId: string, cardId: string, price: number) =>
  cardSchema.parse(await client.request<unknown>({
    path: `${pluginPath}/races/${raceId}/cards/${cardId}/price`,
    method: 'PUT',
    body: { price },
  }))

export const getCardTeams = async (
  raceId: string,
  cardId: string,
  signal?: AbortSignal,
): Promise<CardTeam[]> => cardTeamSchema.array().parse(await client.request<unknown>({
  path: `${pluginPath}/races/${raceId}/cards/${cardId}/teams`,
  signal,
}))

export const getRaceOptions = async (raceId: string, signal?: AbortSignal) => {
  const response = raceOptionsSchema.parse(await client.request<unknown>({
    path: `/Race/${raceId}`,
    signal,
  }))
  return {
    teams: response.raceTeam.map((team) => ({ id: team.teamID, name: team.name })),
    booths: response.booth.map((booth) => ({
      id: booth.id,
      name: booth.name,
      type: booth.type,
      maximumScore: booth.maximumScore ?? null,
    })),
  }
}

export const restockCards = async (raceId: string, quantities: Record<string, number>) => {
  await client.request<boolean>({
    path: `${pluginPath}/races/${raceId}/inventory/restock`,
    method: 'POST',
    body: { quantities },
  })
}

export const updateCardConfig = async (
  raceId: string,
  cardId: string,
  config: Record<string, unknown>,
) => {
  await client.request<boolean>({
    path: `${pluginPath}/races/${raceId}/cards/${cardId}/config`,
    method: 'PUT',
    body: { config },
  })
}

export const assignCard = async (
  raceId: string,
  cardId: string,
  request: { teamId: string; reason: string },
) => cardTeamSchema.parse(await client.request<unknown>({
  path: `${pluginPath}/races/${raceId}/cards/${cardId}/teams`,
  method: 'POST',
  body: request,
}))

export const deleteCardAssignment = async (
  raceId: string,
  teamId: string,
  cardInstanceId: string,
  reason: string,
) => {
  await client.request<boolean>({
    path: `${pluginPath}/races/${raceId}/teams/${teamId}/cards/${cardInstanceId}`,
    method: 'DELETE',
    body: { reason },
  })
}

export const getOverclockWindow = async (raceId: string, signal?: AbortSignal) =>
  overclockWindowSchema.parse(await client.request<unknown>({
    path: `${pluginPath}/races/${raceId}/overclock`,
    signal,
  }))

export const openOverclockWindow = async (raceId: string) =>
  overclockWindowSchema.parse(await client.request<unknown>({
    path: `${pluginPath}/races/${raceId}/overclock/open`,
    method: 'POST',
  }))

export const resolveOverclockWindow = async (raceId: string) =>
  overclockResolutionSchema.parse(await client.request<unknown>({
    path: `${pluginPath}/races/${raceId}/overclock/resolve`,
    method: 'POST',
  }))

export const getPendingRevive = async (
  raceId: string,
  boothId: string,
  signal?: AbortSignal,
) => pendingReviveSchema.nullable().parse(await client.request<unknown>({
  path: `${pluginPath}/races/${raceId}/booths/${boothId}/revive-effect/pending`,
  signal,
}))

export const confirmRevive = async (raceId: string, effectId: string) => {
  await client.request<boolean>({
    path: `${pluginPath}/races/${raceId}/revive-effects/${effectId}/confirm`,
    method: 'POST',
  })
}

export const getTeamCards = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<TeamCard[]> => teamCardSchema.array().parse(await client.request<unknown>({
  path: `${pluginPath}/team/races/${raceId}/cards`,
  signal,
}))

export const getTeamCardShop = async (raceId: string, signal?: AbortSignal) =>
  teamCardShopSchema.parse(await client.request<unknown>({
    path: `${pluginPath}/team/races/${raceId}/shop`,
    signal,
  }))

export const purchaseTeamCard = async (
  raceId: string,
  cardId: string,
  purchaseId: string,
) => cardPurchaseSchema.parse(await client.request<unknown>({
  path: `${pluginPath}/team/races/${raceId}/shop/cards/${cardId}/purchase`,
  method: 'POST',
  body: { purchaseId },
}))

export const getTeamCard = async (
  raceId: string,
  cardInstanceId: string,
  signal?: AbortSignal,
) => teamCardSchema.parse(await client.request<unknown>({
  path: `${pluginPath}/team/races/${raceId}/cards/${cardInstanceId}`,
  signal,
}))

export const useTeamCard = async (
  raceId: string,
  cardInstanceId: string,
  cardUseId: string,
  inputs: Record<string, unknown>,
) => cardUseResponseSchema.parse(await client.request<unknown>({
  path: `${pluginPath}/team/races/${raceId}/cards/${cardInstanceId}/use`,
  method: 'POST',
  body: { cardUseId, inputs },
}))
