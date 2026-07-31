import type { TeamLeaderboardItem } from './liveRace.schemas'

export type LiveRaceSelectedTeam = TeamLeaderboardItem & {
  rank: number
}
