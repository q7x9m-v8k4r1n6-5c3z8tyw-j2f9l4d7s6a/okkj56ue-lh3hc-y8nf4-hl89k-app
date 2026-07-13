import { type RacePayload } from './type';

/**
 * Payload đúng format mà backend API (POST /api/v1/Race) yêu cầu.
 * Dựa theo Swagger request schema.
 */
export interface BackendRacePayload {
  raceName: string;
  timeStart: string;
  timeEnd: string;
  place: string;
  isToggledLeaderboard: boolean;
  isHiddenPoint: boolean;
  organizerId: string[];
  raceTeam: { teamID: string }[];
  booth: {
    name: string;
    place: string;
    organizerID: string;
  }[];
}

export const mapToBackendPayload = (data: RacePayload): BackendRacePayload => {
  return {
    raceName: data.RaceName,
    timeStart: data.TimeStart,
    timeEnd: data.TimeEnd,
    place: data.Place,
    isToggledLeaderboard: data.IsToggledLeaderboard,
    isHiddenPoint: data.IsHiddenPoint,
    organizerId: data.organizers.map((o) => o.OrganizerID),
    raceTeam: data.teams.map((t) => ({ teamID: t.TeamID })),
    booth: data.booths.map((b) => ({
      name: b.Name,
      place: b.Place,
      organizerID: b.BoothOrganizerID,
    })),
  };
};