import { z } from 'zod'
import { client } from '@/core/shared'
import {
  functionCardSchema,
  type FunctionCard,
  type SaveFunctionCardRequest,
} from '../model/mockCards'

const raceTeamsSchema = z.object({
  raceTeam: z.array(z.object({
    teamID: z.string().uuid(),
    name: z.string(),
    leaderEmail: z.string(),
  })).catch([]),
})

export type RaceCardTeam = {
  id: string
  name: string
  email: string
}

export const getFunctionCards = async (raceId: string, signal?: AbortSignal) => {
  const response = await client.request<unknown>({
    path: '/function-cards',
    query: { raceId },
    signal,
  })
  return functionCardSchema.array().parse(response)
}

export const createFunctionCard = async (
  raceId: string,
  request: SaveFunctionCardRequest,
): Promise<FunctionCard> => {
  const response = await client.request<unknown, SaveFunctionCardRequest>({
    path: `/function-cards/races/${raceId}`,
    method: 'POST',
    body: request,
  })
  return functionCardSchema.parse(response)
}

export const updateFunctionCard = async (
  cardId: string,
  request: SaveFunctionCardRequest,
): Promise<FunctionCard> => {
  const response = await client.request<unknown, SaveFunctionCardRequest>({
    path: `/function-cards/${cardId}`,
    method: 'PUT',
    body: request,
  })
  return functionCardSchema.parse(response)
}

export const assignFunctionCardTeam = async (
  cardId: string,
  teamId: string | null,
  expectedModifiedAt: string,
): Promise<FunctionCard> => {
  const response = await client.request<unknown>({
    path: `/function-cards/${cardId}/team`,
    method: 'PUT',
    body: { teamId, expectedModifiedAt },
  })
  return functionCardSchema.parse(response)
}

export const deleteFunctionCard = async (cardId: string) => {
  await client.request<boolean>({ path: `/function-cards/${cardId}`, method: 'DELETE' })
}

export const uploadFunctionCardBackground = async (file: File): Promise<string> => {
  const form = new FormData()
  form.append('file', file)
  const response = await client.request<unknown, FormData>({
    path: '/Image/upload',
    method: 'POST',
    body: form,
  })
  return z.string().url().parse(response)
}

export const getRaceCardTeams = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<RaceCardTeam[]> => {
  const response = raceTeamsSchema.parse(await client.request<unknown>({
    path: `/Race/${raceId}`,
    signal,
  }))
  return response.raceTeam.map((team) => ({
    id: team.teamID,
    name: team.name,
    email: team.leaderEmail,
  }))
}
