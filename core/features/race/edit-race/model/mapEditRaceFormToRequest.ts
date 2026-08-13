import { toGmt7ApiDateTime } from '@/core/shared'
import type {
  EditRaceRequest,
  EditRaceStatus,
} from './editRace.contract'
import type {
  EditRaceBooth,
  EditRaceForm,
} from './editRace.form'

const haveSameIds = (left: string[], right: string[]) => {
  const leftIds = new Set(left)
  const rightIds = new Set(right)
  return leftIds.size === rightIds.size &&
    [...leftIds].every((value) => rightIds.has(value))
}

const createRelationPatch = (before: string[], after: string[]) => {
  const beforeIds = new Set(before)
  const afterIds = new Set(after)
  const add = [...afterIds].filter((id) => !beforeIds.has(id))
  const remove = [...beforeIds].filter((id) => !afterIds.has(id))

  if (!add.length && !remove.length) return undefined
  return {
    ...(add.length ? { add } : {}),
    ...(remove.length ? { remove } : {}),
  }
}

const mapChangedBooth = (
  booth: EditRaceBooth,
  original: EditRaceBooth,
): NonNullable<NonNullable<EditRaceRequest['booths']>['update']>[number] | null => {
  const name = booth.name.trim()
  const place = booth.place.trim()
  const managerIds = booth.managers.map((manager) => manager.id)
  const originalManagerIds = original.managers.map((manager) => manager.id)
  const patch = {
    boothId: booth.id,
    ...(name !== original.name ? { name } : {}),
    ...(place !== original.place ? { place } : {}),
    ...(booth.description !== original.description
      ? { description: booth.description }
      : {}),
    ...(!haveSameIds(managerIds, originalManagerIds)
      ? { organizerIds: [...new Set(managerIds)] }
      : {}),
  }

  return Object.keys(patch).length > 1 ? patch : null
}

/**
 * Creates a minimal PATCH request by comparing the current form with its
 * server baseline. Unchanged fields are deliberately omitted.
 */
export const mapEditRaceFormToRequest = (
  form: EditRaceForm,
  original: EditRaceForm,
  status?: EditRaceStatus,
): EditRaceRequest => {
  const originalBooths = new Map(
    original.booths.map((booth) => [booth.id, booth]),
  )
  const currentBoothIds = new Set(form.booths.map((booth) => booth.id))

  const boothAdd = form.booths
    .filter((booth) => !originalBooths.has(booth.id))
    .map((booth) => ({
      name: booth.name.trim(),
      place: booth.place.trim(),
      description: booth.description,
      isHidden: booth.isHidden,
      organizerIds: [...new Set(booth.managers.map((manager) => manager.id))],
    }))
  const boothUpdate = form.booths
    .map((booth) => {
      const originalBooth = originalBooths.get(booth.id)
      return originalBooth ? mapChangedBooth(booth, originalBooth) : null
    })
    .filter((booth): booth is NonNullable<typeof booth> => booth !== null)
  const boothRemove = original.booths
    .filter((booth) => !currentBoothIds.has(booth.id))
    .map((booth) => booth.id)

  const raceName = form.raceName.trim()
  const place = form.place.trim()
  const nextStatus = status ?? form.status
  const basicInfo = {
    ...(raceName !== original.raceName ? { raceName } : {}),
    ...(form.timeStart !== original.timeStart
      ? { timeStart: toGmt7ApiDateTime(form.timeStart) }
      : {}),
    ...(form.timeEnd !== original.timeEnd
      ? { timeEnd: toGmt7ApiDateTime(form.timeEnd) }
      : {}),
    ...(place !== original.place ? { place } : {}),
    ...(nextStatus !== original.status ? { status: nextStatus } : {}),
    ...(form.rules !== original.rules ? { rules: form.rules } : {}),
  }
  const raceSettings = {
    ...(form.settings.isToggledLeaderboard !==
    original.settings.isToggledLeaderboard
      ? { isToggledLeaderboard: form.settings.isToggledLeaderboard }
      : {}),
    ...(form.settings.isHiddenPoint !== original.settings.isHiddenPoint
      ? { isHiddenPoint: form.settings.isHiddenPoint }
      : {}),
  }
  const organizers = createRelationPatch(
    original.organizers.map((organizer) => organizer.id),
    form.organizers.map((organizer) => organizer.id),
  )
  const raceTeams = createRelationPatch(
    original.teams.map((team) => team.id),
    form.teams.map((team) => team.id),
  )
  const booths = {
    ...(boothAdd.length ? { add: boothAdd } : {}),
    ...(boothUpdate.length ? { update: boothUpdate } : {}),
    ...(boothRemove.length ? { remove: boothRemove } : {}),
  }

  return {
    expectedModifiedAt: original.modifiedAt,
    ...(Object.keys(basicInfo).length ? { basicInfo } : {}),
    ...(Object.keys(raceSettings).length ? { raceSettings } : {}),
    ...(organizers ? { organizers } : {}),
    ...(raceTeams ? { raceTeams } : {}),
    ...(Object.keys(booths).length ? { booths } : {}),
  }
}
