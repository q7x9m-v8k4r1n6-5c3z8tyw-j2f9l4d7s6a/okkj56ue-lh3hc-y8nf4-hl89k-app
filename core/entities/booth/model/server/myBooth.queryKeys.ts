export const myBoothQueryKeys = {
  all: ['booth', 'my-booth'] as const,
  detail: (raceId?: string) => [...myBoothQueryKeys.all, raceId] as const,
}
