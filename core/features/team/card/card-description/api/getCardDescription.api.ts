import { client } from '@/core/shared/api'
import { cardInfoSchema, type CardInfoDto } from '../model/cardDescription.contract'

export const getTeamCardDescription = async (
  cardId: string,
  signal?: AbortSignal
): Promise<CardInfoDto> => {
  const response = await client.request<unknown>({
    path: `/function-cards/team/cards/${cardId}`,
    method: 'GET',
    signal,
  })

  return cardInfoSchema.parse((response as any).data ?? response)
}