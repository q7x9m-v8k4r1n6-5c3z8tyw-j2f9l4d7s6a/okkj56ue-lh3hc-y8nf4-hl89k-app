export const adminSecretMissionQueryKeys = {
  all: ['plugin', 'admin-secret-missions'] as const,
  overview: (raceId?: string) =>
    [...adminSecretMissionQueryKeys.all, 'overview', raceId] as const,
  detail: (missionId?: string) =>
    [...adminSecretMissionQueryKeys.all, 'detail', missionId] as const,
}