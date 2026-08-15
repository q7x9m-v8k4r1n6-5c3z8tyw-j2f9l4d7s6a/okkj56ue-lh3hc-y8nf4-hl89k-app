import { toGmt7ApiDateTime } from '@/core/shared'
import type { EditRaceDetailResponse } from './editRace.contract'
import type {
  EditRaceForm,
  EditRaceOrganizer,
} from './editRace.form'

const splitIds = (value?: string | null) =>
  (value ?? '')
    .split(/[|,;]/)
    .map((id) => id.trim())
    .filter(Boolean)

const findOrganizer = (
  organizers: EditRaceOrganizer[],
  id: string,
  index: number,
): EditRaceOrganizer =>
  organizers.find((organizer) => organizer.id === id) ?? {
    id,
    displayName: `Ban tổ chức ${index + 1}`,
    email: '',
  }

/**
 * Converts the backend race detail DTO and the separately-fetched rules text
 * into the frontend editor model.
 */
export const mapRaceDetailToForm = (
  detail: EditRaceDetailResponse,
  rules: string,
): EditRaceForm => {
  const organizerLookup = detail.organizers ?? detail.organizerId.map((id, index) => ({
    id,
    displayName: `Ban tổ chức ${index + 1}`,
    email: '',
  }))

  return {
    raceName: detail.raceName,
    timeStart: toGmt7ApiDateTime(detail.timeStart),
    timeEnd: toGmt7ApiDateTime(detail.timeEnd),
    coverUrl: detail.coverUrl ?? '',
    coverFileName: detail.coverUrl?.split('/').pop() ?? '',
    place: detail.place,
    status: detail.status,
    modifiedAt: detail.modifiedAt,
    rules,
    booths: detail.booth.map((booth) => ({
      id: booth.id,
      name: booth.name,
      place: booth.place,
      managers: splitIds(booth.organizerID).map((id, index) =>
        findOrganizer(organizerLookup, id, index),
      ),
      description: booth.description ?? '',
      isHidden: booth.isHidden,
    })),
    teams: detail.raceTeam.map((team, index) => ({
      id: team.teamID,
      name: team.name || `Đội ${index + 1}`,
      leaderEmail: team.leaderEmail ?? '',
    })),
    organizers: detail.organizerId.map((id, index) =>
      findOrganizer(organizerLookup, id, index),
    ),
    settings: {
      isToggledLeaderboard: detail.isToggledLeaderboard,
      isHiddenPoint: detail.isHiddenPoint,
    },
  }
}
