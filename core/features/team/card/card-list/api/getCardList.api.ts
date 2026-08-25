import { client } from '@/core/shared/api'
import { z } from 'zod'
import { cardItemSchema, type CardItemDto } from '../model/cardList.contract'

export const getTeamCardList = async (
  raceId: string,
  signal?: AbortSignal
): Promise<CardItemDto[]> => {
  const response = await client.request<unknown>({
    path: `/function-cards/team/races/${raceId}`,
    method: 'GET',
    signal,
  })

  return z.array(cardItemSchema).parse((response as any).data ?? response)
}