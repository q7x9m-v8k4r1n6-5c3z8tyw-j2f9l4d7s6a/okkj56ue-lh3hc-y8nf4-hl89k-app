import type { RaceDetailModel, RaceOrganizerDetail, RaceTeamDetail, RaceBoothDetail } from '@/core/entities/race'
import { isUpcomingRaceStatus } from '@/core/entities/race'
import type { RaceDraftPayload, StationDraft } from '../../create-race/stores/createRaceSlice'

const toDateTimeLocal = (value?: string) => {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value.slice(0, 16)

  const timezoneOffset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

const firstText = (...values: Array<string | undefined>) => {
  return values.find((value) => value?.trim())?.trim() ?? ''
}

const getTeamId = (team: RaceTeamDetail) => firstText(team.id, team.teamId, team.teamID)
const getOrganizerId = (organizer: RaceOrganizerDetail) => firstText(organizer.id, organizer.organizerId)

const buildFallbackOrganizer = (id: string): RaceOrganizerDetail => ({
  id,
  displayName: id,
  email: '',
})

const getStationManagers = (station: RaceBoothDetail): RaceOrganizerDetail[] => {
  if (station.managers?.length) return station.managers

  const ids = [
    ...(station.managerIds ?? []),
    ...firstText(station.organizerID, station.organizerId).split('|'),
  ].map((id) => id.trim()).filter(Boolean)

  return ids.map(buildFallbackOrganizer)
}

/**
 * Mapper thuoc feature edit-race: chuyen Race detail tu API thanh draft cua form.
 * Form dang duoc quan ly trong create-race slice, nen edit feature chi hydrate du lieu dau vao.
 */
export const mapRaceDetailToDraft = (race: RaceDetailModel): RaceDraftPayload => {
  const teams = race.raceTeam ?? race.teams ?? []
  const organizers = race.organizers ?? []
  const booths = race.booth ?? race.booths ?? race.stations ?? []

  return {
    basic: {
      name: firstText(race.raceName, race.name),
      startAt: toDateTimeLocal(firstText(race.timeStart, race.startAt)),
      endAt: toDateTimeLocal(firstText(race.timeEnd, race.endAt)),
      imageName: firstText(race.imageName, race.coverUrl),
      coverUrl: firstText(race.coverUrl),
      location: firstText(race.place, race.location),
    },
    stations: booths.map<StationDraft>((station) => ({
      id: firstText(station.id, station.boothId) || crypto.randomUUID(),
      name: firstText(station.name),
      location: firstText(station.place, station.location),
      description: firstText(station.description),
      managers: getStationManagers(station).map((manager) => ({
        id: getOrganizerId(manager),
        displayName: firstText(manager.displayName, manager.name, manager.email),
        email: firstText(manager.email),
      })),
    })),
    teams: teams.map((team) => ({
      id: getTeamId(team),
      name: firstText(team.name, team.email, team.leaderEmail),
      email: firstText(team.email, team.leaderEmail),
    })).filter((team) => team.id),
    organizers: organizers.map((organizer) => ({
      id: getOrganizerId(organizer),
      name: firstText(organizer.displayName, organizer.name, organizer.email),
      email: firstText(organizer.email),
    })).filter((organizer) => organizer.id),
    settings: {
      disableLeaderboard: race.isToggledLeaderboard ?? false,
      hideScores: race.isHiddenPoint ?? false,
    },
  }
}

export const canEditRace = (race: RaceDetailModel) => {
  return isUpcomingRaceStatus(
    race.status,
    firstText(race.timeStart, race.startAt),
    firstText(race.timeEnd, race.endAt),
  )
}
