export const teamBoothSessionQueryKeys = {
  all: ['team', 'booth-session'] as const,
  detail: (raceId?: string) => [
    ...teamBoothSessionQueryKeys.all,
    raceId,
  ] as const,
}
