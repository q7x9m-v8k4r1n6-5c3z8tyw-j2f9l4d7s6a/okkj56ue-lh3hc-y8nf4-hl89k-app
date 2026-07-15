import type { CreateRaceState } from '../stores/createRaceSlice'
import { toIsoString } from '@/core/shared'

/**
 * Cấu trúc JSON thật giống bên backend .NET (POST /api/v1/Race)
 */
export interface BackendCreateRaceRequest {
  raceName: string
  timeStart: string
  timeEnd: string
  place: string
  isToggledLeaderboard: boolean
  isHiddenPoint: boolean
  organizerId: string[]
  raceTeam: { teamID: string }[]
  booth: {
    name: string
    place: string
    organizerId: string | null 
    description?: string
  }[]
  coverUrl?: string
}

/**
 * Đóng gói toàn bộ CreateRaceState 
 * thành đúng format JSON mà backend .NET cần nhận.
 */
export const mapToBackendRequest = (state: CreateRaceState): BackendCreateRaceRequest => {
  return {
    raceName: state.basic.name.trim(),
    place: state.basic.location.trim(),
    timeStart: toIsoString(state.basic.startAt),
    timeEnd: toIsoString(state.basic.endAt),
    isToggledLeaderboard: state.settings.disableLeaderboard,
    isHiddenPoint: state.settings.hideScores,
    coverUrl: state.basic.coverUrl || undefined,
    organizerId: state.organizers.map((o) => o.id),
    raceTeam: state.teams.map((t) => ({ teamID: t.id })),
    booth: state.stations
      .filter((s) => s.name.trim() && s.location.trim()) 
      .map((s) => ({
        name: s.name.trim(),
        place: s.location.trim(),
        organizerId: s.managers[0]?.id ?? null, 
        description: s.description?.trim() ?? "",
      })),
  }
}