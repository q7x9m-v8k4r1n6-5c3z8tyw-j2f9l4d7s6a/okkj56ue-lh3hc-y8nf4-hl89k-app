import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  assignCard,
  deleteCardAssignment,
  getCardStore,
  getCardTeams,
  getOverclockWindow,
  getRaceOptions,
  getTeamCard,
  getTeamCards,
  restockCards,
  openOverclockWindow,
  resolveOverclockWindow,
  updateCardConfig,
  useTeamCard as submitTeamCard,
} from '../../api/card.api'

const keys = {
  store: (raceId: string) => ['plugin', 'cards', 'store', raceId] as const,
  teams: (raceId: string, cardId: string) => ['plugin', 'cards', 'teams', raceId, cardId] as const,
  raceOptions: (raceId: string) => ['race', 'card-options', raceId] as const,
  teamCards: (raceId: string) => ['plugin', 'cards', 'team', raceId] as const,
  teamCard: (raceId: string, cardInstanceId: string) => ['plugin', 'cards', 'team', raceId, cardInstanceId] as const,
  overclock: (raceId: string) => ['plugin', 'cards', 'overclock', raceId] as const,
}

export const useCardStore = (raceId?: string) => useQuery({
  queryKey: keys.store(raceId ?? ''),
  queryFn: ({ signal }) => getCardStore(raceId!, signal),
  enabled: Boolean(raceId),
})

export const useCardTeams = (raceId?: string, cardId?: string) => useQuery({
  queryKey: keys.teams(raceId ?? '', cardId ?? ''),
  queryFn: ({ signal }) => getCardTeams(raceId!, cardId!, signal),
  enabled: Boolean(raceId && cardId),
})

export const useRaceOptions = (raceId?: string) => useQuery({
  queryKey: keys.raceOptions(raceId ?? ''),
  queryFn: ({ signal }) => getRaceOptions(raceId!, signal),
  enabled: Boolean(raceId),
})

export const useOverclockWindow = (raceId?: string) => useQuery({
  queryKey: keys.overclock(raceId ?? ''),
  queryFn: ({ signal }) => getOverclockWindow(raceId!, signal),
  enabled: Boolean(raceId),
})

export const useOverclockMutations = (raceId: string) => {
  const queryClient = useQueryClient()
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: keys.overclock(raceId) })
    void queryClient.invalidateQueries({ queryKey: keys.teamCards(raceId) })
  }
  return {
    open: useMutation({ mutationFn: () => openOverclockWindow(raceId), onSuccess: invalidate }),
    resolve: useMutation({ mutationFn: () => resolveOverclockWindow(raceId), onSuccess: invalidate }),
  }
}

export const useCardStoreMutations = (raceId: string) => {
  const queryClient = useQueryClient()
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: keys.store(raceId) })
    void queryClient.invalidateQueries({ queryKey: ['plugin', 'cards', 'teams', raceId] })
  }
  return {
    restock: useMutation({
      mutationFn: (quantities: Record<string, number>) => restockCards(raceId, quantities),
      onSuccess: invalidate,
    }),
    config: useMutation({
      mutationFn: (input: { cardId: string; config: Record<string, unknown> }) =>
        updateCardConfig(raceId, input.cardId, input.config),
      onSuccess: invalidate,
    }),
    assign: useMutation({
      mutationFn: (input: { cardId: string; teamId: string; teamName: string; reason: string }) =>
        assignCard(raceId, input.cardId, input),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (input: { cardId: string; teamId: string; cardInstanceId: string; reason: string }) =>
        deleteCardAssignment(raceId, input.teamId, input.cardInstanceId, input.reason),
      onSuccess: invalidate,
    }),
  }
}

export const useTeamCardList = (raceId?: string) => useQuery({
  queryKey: keys.teamCards(raceId ?? ''),
  queryFn: ({ signal }) => getTeamCards(raceId!, signal),
  enabled: Boolean(raceId),
})

export const useTeamCardDetail = (raceId?: string, cardInstanceId?: string) => useQuery({
  queryKey: keys.teamCard(raceId ?? '', cardInstanceId ?? ''),
  queryFn: ({ signal }) => getTeamCard(raceId!, cardInstanceId!, signal),
  enabled: Boolean(raceId && cardInstanceId),
})

export const useUseTeamCard = (raceId: string, cardInstanceId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { cardUseId: string; inputs: Record<string, unknown> }) =>
      submitTeamCard(raceId, cardInstanceId, input.cardUseId, input.inputs),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: keys.teamCards(raceId) })
      void queryClient.invalidateQueries({ queryKey: keys.teamCard(raceId, cardInstanceId) })
    },
  })
}
