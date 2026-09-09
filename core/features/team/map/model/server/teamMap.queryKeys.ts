export const teamMapQueryKeys = {
  all: ['team', 'map'] as const,
  detail: (raceId: string) => [
    ...teamMapQueryKeys.all,
    raceId,
  ] as const,
}
