export const cardListQueryKeys = {
  all: ['team', 'card-list'] as const,
  list: (raceId?: string) => [...cardListQueryKeys.all, raceId] as const,
}