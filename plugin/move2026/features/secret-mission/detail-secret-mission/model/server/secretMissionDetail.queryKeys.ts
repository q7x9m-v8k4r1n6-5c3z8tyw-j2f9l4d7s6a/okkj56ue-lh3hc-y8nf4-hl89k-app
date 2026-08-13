export const secretMissionDetailQueryKeys = {
  all: ['plugin', 'secret-mission-detail'] as const,
  detail: (missionId?: string) =>
    [...secretMissionDetailQueryKeys.all, missionId] as const,
}