import { useCallback, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { OrganizerModel } from '@/core/entities/organizer'
import { useOrganizerQuery } from '@/core/entities/organizer/hooks'
import { useTeamQuery, type TeamModel } from '@/core/entities/team'
import { raceQueryKey } from '@/core/features/race/constants'
import { getCurrentGmt7InstantString, toGmt7ApiDateTime, useAppDispatch, useAppSelector } from '@/core/shared'
import { EDIT_RACE_INITIAL_FORM } from '../constants'
import { getRaceDetail } from '../api'
import { useEditRaceMutation } from '../hooks'
import type { EditRaceDetailResponse, EditRaceForm, EditRaceOrganizer, EditRaceRequest, EditRaceTeam } from '../models'
import { editRaceActions } from '../stores'

const toDateTimeInputValue = (value?: string) => {
  if (!value) return ''
  return toGmt7ApiDateTime(value)
}

const splitIds = (value?: string | string[]) => {
  if (Array.isArray(value)) return value.filter(Boolean)
  return (value ?? '')
    .split(/[|,;]/)
    .map((id) => id.trim())
    .filter(Boolean)
}

const normalizeCollection = <T,>(value: T[] | { data?: T[]; items?: T[] } | undefined): T[] => {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.data)) return value.data
  if (Array.isArray(value?.items)) return value.items
  return []
}

const findOrganizer = (organizers: OrganizerModel[], id: string, index: number): EditRaceOrganizer => {
  const organizer = organizers.find((item) => item.id === id)

  if (organizer) {
    return {
      id: organizer.id,
      displayName: organizer.displayName ?? organizer.email,
      email: organizer.email,
    }
  }

  return {
    id,
    displayName: `Quản trạm ${index + 1}`,
    email: `${id}@move.local`,
  }
}

const mapOrganizerIds = (organizerIds: string[] | undefined, organizers: OrganizerModel[]) => (
  organizerIds?.map((id, index) => findOrganizer(organizers, id, index)) ?? []
)

const mapTeam = (raceTeam: NonNullable<EditRaceDetailResponse['raceTeam']>[number], index: number, teams: TeamModel[]): EditRaceTeam => {
  const id = raceTeam.team?.id || raceTeam.teamID || raceTeam.teamId || `team-${index + 1}`
  const matchedTeam = teams.find((team) => team.id === id)

  return {
    id,
    name: raceTeam.team?.name || raceTeam.name || matchedTeam?.name || `Đội ${index + 1}`,
    leaderEmail: raceTeam.team?.leaderEmail || raceTeam.leaderEmail || matchedTeam?.leaderEmail || `doi${index + 1}@gmail.com`,
  }
}

const mapDetailToForm = (detail: EditRaceDetailResponse, teams: TeamModel[], organizers: OrganizerModel[]): EditRaceForm => ({
  raceName: detail.raceName || detail.name || EDIT_RACE_INITIAL_FORM.raceName,
  timeStart: toDateTimeInputValue(detail.timeStart) || EDIT_RACE_INITIAL_FORM.timeStart,
  timeEnd: toDateTimeInputValue(detail.timeEnd) || EDIT_RACE_INITIAL_FORM.timeEnd,
  coverUrl: detail.coverUrl ?? '',
  coverFileName: detail.coverUrl ? detail.coverUrl.split('/').pop() ?? '' : '',
  place: detail.place || EDIT_RACE_INITIAL_FORM.place,
  status: detail.status || EDIT_RACE_INITIAL_FORM.status,
  modifiedAt: detail.modifiedAt || detail.modifiedAtUtc || detail.updatedAt || EDIT_RACE_INITIAL_FORM.modifiedAt,
  booths: detail.booth?.map((booth, index) => {
    const managerIds = splitIds(booth.managerIds ?? booth.organizerID ?? booth.organizerId ?? booth.managerId)

    return {
      id: booth.id || booth.boothId || `booth-${index + 1}`,
      name: booth.name || `Trạm ${index + 1}`,
      place: booth.place || booth.location || '',
      managers: booth.managers?.length
        ? booth.managers.map((manager) => ({
          id: manager.id,
          displayName: manager.displayName ?? manager.email,
          email: manager.email,
        }))
        : managerIds.map((id, managerIndex) => findOrganizer(organizers, id, managerIndex)),
      description: booth.description || '',
    }
  }) ?? [],
  teams: detail.raceTeam?.map((team, index) => mapTeam(team, index, teams)) ?? [],
  organizers: mapOrganizerIds(detail.organizerId, organizers),
  settings: {
    isToggledLeaderboard: detail.isToggledLeaderboard ?? EDIT_RACE_INITIAL_FORM.settings.isToggledLeaderboard,
    isHiddenPoint: detail.isHiddenPoint ?? EDIT_RACE_INITIAL_FORM.settings.isHiddenPoint,
  },
})

const buildEditRaceRequest = (form: EditRaceForm, status = form.status): EditRaceRequest => ({
  raceName: form.raceName,
  timeStart: toGmt7ApiDateTime(form.timeStart),
  timeEnd: toGmt7ApiDateTime(form.timeEnd),
  place: form.place,
  coverUrl: form.coverUrl,
  status: status as EditRaceRequest['status'],
  isToggledLeaderboard: form.settings.isToggledLeaderboard,
  isHiddenPoint: form.settings.isHiddenPoint,
  organizerId: form.organizers.map((organizer) => organizer.id),
  raceTeam: form.teams.map((team) => ({ teamID: team.id })),
  booth: form.booths.map((booth) => ({
    name: booth.name,
    place: booth.place,
    description: booth.description,
    organizerID: booth.managers.map((manager) => manager.id).join('|'),
  })),
})

const mapTeamSelection = (teams: TeamModel[]) => (
  teams.map((team) => ({ id: team.id, name: team.name, leaderEmail: team.leaderEmail }))
)

const mapOrganizerSelection = (organizers: OrganizerModel[]) => (
  organizers.map((organizer) => ({
    id: organizer.id,
    displayName: organizer.displayName ?? organizer.email,
    email: organizer.email,
  }))
)

export const useEditRaceView = (raceId?: string) => {
  const dispatch = useAppDispatch()
  const form = useAppSelector((state) => state.editRace.form)
  const isEditing = useAppSelector((state) => state.editRace.isEditing)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const teamQuery = useTeamQuery()
  const organizerQuery = useOrganizerQuery()
  const editRace = useEditRaceMutation()

  const teams = normalizeCollection(teamQuery.data)
  const organizers = normalizeCollection(organizerQuery.data)

  const detailQuery = useQuery({
    queryKey: [...raceQueryKey, 'detail', raceId],
    queryFn: ({ signal }) => getRaceDetail(raceId ?? '', signal),
    enabled: Boolean(raceId),
    retry: false,
  })

  useEffect(() => {
    dispatch(editRaceActions.resetEditRace())
  }, [dispatch, raceId])

  const applyRaceDetail = useCallback((detail: EditRaceDetailResponse) => {
    dispatch(editRaceActions.setForm(mapDetailToForm(detail, teams, organizers)))
  }, [dispatch, organizers, teams])

  useEffect(() => {
    if (!detailQuery.data) return
    applyRaceDetail(detailQuery.data)
  }, [applyRaceDetail, detailQuery.data])

  const saveRace = async (status?: string) => {
    if (!raceId || !detailQuery.data) return

    const updatedRace = await editRace.mutateAsync({
      payload: buildEditRaceRequest(form, status),
      raceId,
    })

    applyRaceDetail({
      ...updatedRace,
      modifiedAt: getCurrentGmt7InstantString(),
    })
    dispatch(editRaceActions.setEditing(false))
  }

  const updateBasic = (changes: Partial<Pick<EditRaceForm, 'raceName' | 'timeStart' | 'timeEnd' | 'coverUrl' | 'coverFileName' | 'place'>>) => {
    dispatch(editRaceActions.updateBasic(changes))
  }

  const updateBooth = (id: string, changes: Partial<EditRaceForm['booths'][number]>) => {
    dispatch(editRaceActions.updateBooth({ id, changes }))
  }

  const removeBooth = (id: string) => {
    dispatch(editRaceActions.removeBooth(id))
  }

  const addBooth = () => {
    dispatch(editRaceActions.addBooth())
  }

  const addTeam = (selectedTeams: TeamModel[]) => {
    dispatch(editRaceActions.addTeams(mapTeamSelection(selectedTeams)))
  }

  const removeTeam = (id: string) => {
    dispatch(editRaceActions.removeTeam(id))
  }

  const addOrganizer = (selectedOrganizers: OrganizerModel[]) => {
    dispatch(editRaceActions.addOrganizers(mapOrganizerSelection(selectedOrganizers)))
  }

  const removeOrganizer = (id: string) => {
    dispatch(editRaceActions.removeOrganizer(id))
  }

  const updateSetting = (key: keyof EditRaceForm['settings'], value: boolean) => {
    dispatch(editRaceActions.updateSetting({ key, value }))
  }

  const openImagePicker = () => imageInputRef.current?.click()

  const handleImageSelected = (file?: File) => {
    if (!file) return
    updateBasic({ coverFileName: file.name, coverUrl: URL.createObjectURL(file) })
  }

  const resetForm = () => {
    dispatch(editRaceActions.setForm(detailQuery.data ? mapDetailToForm(detailQuery.data, teams, organizers) : EDIT_RACE_INITIAL_FORM))
    editRace.reset()
  }

  return {
    addBooth,
    addOrganizer,
    addTeam,
    detailQuery,
    endRace: () => saveRace('completed'),
    form,
    handleImageSelected,
    imageInputRef,
    isEditing,
    isLoadingDetail: detailQuery.isLoading,
    isSaving: editRace.isPending,
    openImagePicker,
    pauseRace: () => saveRace('paused'),
    publishRace: () => saveRace('ready'),
    removeBooth,
    removeOrganizer,
    removeTeam,
    resetForm,
    resumeRace: () => saveRace('ongoing'),
    saveChanges: () => saveRace(),
    saveDisabled: !raceId || !detailQuery.data || detailQuery.isLoading || detailQuery.isError,
    saveError: editRace.error,
    detailError: detailQuery.error,
    startEditing: () => dispatch(editRaceActions.setEditing(true)),
    startRace: () => saveRace('ongoing'),
    updateBasic,
    updateBooth,
    updateSetting,
  }
}
