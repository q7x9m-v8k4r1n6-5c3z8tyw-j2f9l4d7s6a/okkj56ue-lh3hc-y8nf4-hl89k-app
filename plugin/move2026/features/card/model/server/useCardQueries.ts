import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  assignCard,
  deleteCardAssignment,
  getCardStore,
  getCardTeams,
  getRaceTeams,
  getTeamCard,
  getTeamCards,
  restockCards,
  scheduleRestock,
  setStoreOpen,
  updateCardConfig,
  useTeamCard as submitTeamCard,
} from '../../api/card.api'

const keys = {
  store: (raceId: string) => ['plugin', 'cards', 'store', raceId] as const,
  teams: (raceId: string, cardId: string) => ['plugin', 'cards', 'teams', raceId, cardId] as const,
  raceTeams: (raceId: string) => ['race', 'teams', raceId] as const,
  teamCards: (raceId: string) => ['plugin', 'cards', 'team', raceId] as const,
  teamCard: (raceId: string, cardId: string) => ['plugin', 'cards', 'team', raceId, cardId] as const,
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

export const useRaceTeams = (raceId?: string) => useQuery({
  queryKey: keys.raceTeams(raceId ?? ''),
  queryFn: ({ signal }) => getRaceTeams(raceId!, signal),
  enabled: Boolean(raceId),
})

export const useCardStoreMutations = (raceId: string) => {
  const queryClient = useQueryClient()
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: keys.store(raceId) })
    void queryClient.invalidateQueries({ queryKey: ['plugin', 'cards', 'teams', raceId] })
  }
  return {
    store: useMutation({ mutationFn: (open: boolean) => setStoreOpen(raceId, open), onSuccess: invalidate }),
    restock: useMutation({ mutationFn: (quantities: Record<string, number>) => restockCards(raceId, quantities), onSuccess: invalidate }),
    schedule: useMutation({ mutationFn: (input: { scheduledAt: string; quantities: Record<string, number> }) => scheduleRestock(raceId, input.scheduledAt, input.quantities), onSuccess: invalidate }),
    config: useMutation({ mutationFn: (input: { cardId: string; config: Record<string, string> }) => updateCardConfig(raceId, input.cardId, input.config), onSuccess: invalidate }),
    assign: useMutation({ mutationFn: (input: { cardId: string; teamId: string; teamName: string; reason: string }) => assignCard(raceId, input.cardId, input), onSuccess: invalidate }),
    remove: useMutation({ mutationFn: (input: { cardId: string; teamId: string; reason: string }) => deleteCardAssignment(raceId, input.cardId, input.teamId, input.reason), onSuccess: invalidate }),
  }
}

export const useTeamCardList = (raceId?: string) => useQuery({
  queryKey: keys.teamCards(raceId ?? ''),
  queryFn: ({ signal }) => getTeamCards(raceId!, signal),
  enabled: Boolean(raceId),
})

export const useTeamCardDetail = (raceId?: string, cardId?: string) => useQuery({
  queryKey: keys.teamCard(raceId ?? '', cardId ?? ''),
  queryFn: ({ signal }) => getTeamCard(raceId!, cardId!, signal),
  enabled: Boolean(raceId && cardId),
})

export const useUseTeamCard = (raceId: string, cardId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (inputs: Record<string, string>) => submitTeamCard(raceId, cardId, inputs),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: keys.teamCards(raceId) })
      void queryClient.invalidateQueries({ queryKey: keys.teamCard(raceId, cardId) })
    },
  })
}
