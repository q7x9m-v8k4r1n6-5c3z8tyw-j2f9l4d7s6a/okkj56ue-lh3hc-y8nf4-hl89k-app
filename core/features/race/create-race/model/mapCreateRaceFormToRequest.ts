import { getCurrentGmt7DateTime, toGmt7ApiDateTime } from '@/core/shared'
import type { CreateRaceRequest } from './createRace.contract'
import type { CreateRaceFormState } from './createRace.form'
import { hasStationContent } from './createRace.validation'

/** Converts frontend form names and values into the backend request contract. */
export const mapCreateRaceFormToRequest = (
  form: CreateRaceFormState,
): CreateRaceRequest => ({
  basicInfo: {
    raceName: form.basic.name.trim(),
    place: form.basic.location.trim(),
    timeStart: form.basic.startAt
      ? toGmt7ApiDateTime(form.basic.startAt)
      : getCurrentGmt7DateTime(),
    timeEnd: form.basic.endAt
      ? toGmt7ApiDateTime(form.basic.endAt)
      : getCurrentGmt7DateTime(),
  },
  rules: form.basic.rules?.trim() || undefined, 
  organizerId: form.organizers.map((organizer) => organizer.id),
  raceTeam: form.teams.map((team) => team.id),
  booths: form.stations.filter(hasStationContent).map((station) => ({
    name: station.name.trim(),
    place: station.location.trim(),
    description: station.description || undefined,
    organizerIds: station.managers.map((manager) => manager.id),
  })),
  raceSettings: {
    isToggledLeaderboard: form.settings.showLeaderboard,
    isHiddenPoint: !form.settings.showScores,
  },
})
