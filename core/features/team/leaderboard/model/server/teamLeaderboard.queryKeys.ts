export const teamLeaderboardQueryKeys = {
  all: ['team-results'] as const,
  leaderboard: (raceId?: string) =>
    [...teamLeaderboardQueryKeys.all, 'leaderboard', raceId] as const,
  history: (raceId?: string) =>
    [...teamLeaderboardQueryKeys.all, 'history', raceId] as const,
}
