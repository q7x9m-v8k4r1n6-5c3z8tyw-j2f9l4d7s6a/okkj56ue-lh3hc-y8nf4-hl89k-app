import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  assignFunctionCardTeam,
  createFunctionCard,
  deleteFunctionCard,
  getFunctionCards,
  getRaceCardTeams,
  updateFunctionCard,
  uploadFunctionCardBackground,
} from '../../api/functionCard.api'
import type { SaveFunctionCardRequest } from '../mockCards'

const keys = {
  cards: (raceId: string) => ['function-cards', raceId] as const,
  teams: (raceId: string) => ['function-card-teams', raceId] as const,
}

export const useFunctionCards = (raceId: string) => useQuery({
  queryKey: keys.cards(raceId),
  queryFn: ({ signal }) => getFunctionCards(raceId, signal),
  enabled: Boolean(raceId),
})

export const useFunctionCardTeams = (raceId: string) => useQuery({
  queryKey: keys.teams(raceId),
  queryFn: ({ signal }) => getRaceCardTeams(raceId, signal),
  enabled: Boolean(raceId),
})

export const useFunctionCardMutations = (raceId: string) => {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: keys.cards(raceId) })

  const create = useMutation({
    mutationFn: (request: SaveFunctionCardRequest) => createFunctionCard(raceId, request),
    onSuccess: invalidate,
  })
  const update = useMutation({
    mutationFn: ({ cardId, request }: { cardId: string; request: SaveFunctionCardRequest }) =>
      updateFunctionCard(cardId, request),
    onSuccess: invalidate,
  })
  const assignTeam = useMutation({
    mutationFn: ({ cardId, teamId, expectedModifiedAt }: { cardId: string; teamId: string | null; expectedModifiedAt: string }) =>
      assignFunctionCardTeam(cardId, teamId, expectedModifiedAt),
    onSuccess: invalidate,
  })
  const remove = useMutation({ mutationFn: deleteFunctionCard, onSuccess: invalidate })
  const uploadBackground = useMutation({ mutationFn: uploadFunctionCardBackground })

  return { assignTeam, create, remove, update, uploadBackground }
}
