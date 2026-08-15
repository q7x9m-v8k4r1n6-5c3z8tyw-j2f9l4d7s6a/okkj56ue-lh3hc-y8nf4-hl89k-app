export const secretMissionQueryKeys = {
  all: ['plugin', 'secret-missions'] as const,
  overview: (raceId?: string) =>
    [...secretMissionQueryKeys.all, 'overview', raceId] as const,
}