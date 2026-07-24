import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { OrganizerModel } from '@/core/entities/organizer'
import { useOrganizerQuery } from '@/core/entities/organizer/hooks'
import { useTeamQuery, type TeamModel } from '@/core/entities/team'
import { raceQueryKey } from '@/core/features/race/constants'
import { getCurrentGmt7InstantString, toGmt7ApiDateTime } from '@/core/shared'
import { EDIT_RACE_INITIAL_FORM } from '../constants'
import { getRaceDetail, updateRace } from '../api'
import type { EditRaceDetailResponse, EditRaceForm, EditRaceOrganizer, EditRaceRequest, EditRaceTeam } from '../models'

const toDateTimeInputValue = (value?: string) => {
  if (!value) return ''
  return toGmt7ApiDateTime(value)
}

const toApiDateTime = (value: string) => toGmt7ApiDateTime(value)

const normalizeCollection = <T,>(value: T[] | { data?: T[]; items?: T[] } | undefined): T[] => {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.data)) return value.data
  if (Array.isArray(value?.items)) return value.items
  return []
}

const splitIds = (value?: string | string[]) => {
  if (Array.isArray(value)) return value.filter(Boolean)
  return (value ?? '')
    .split(/[|,;]/)
    .map((id) => id.trim())
    .filter(Boolean)
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
      managers: booth.managers?.length ? booth.managers : managerIds.map((id, managerIndex) => findOrganizer(organizers, id, managerIndex)),
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

const mapFormToRequest = (form: EditRaceForm, status = form.status): EditRaceRequest => ({
  raceName: form.raceName,
  timeStart: toApiDateTime(form.timeStart),
  timeEnd: toApiDateTime(form.timeEnd),
  place: form.place,
  coverUrl: form.coverUrl,
  status,
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

export const useEditRace = (raceId?: string) => {
  const [form, setForm] = useState<EditRaceForm>(EDIT_RACE_INITIAL_FORM)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const teamQuery = useTeamQuery()
  const organizerQuery = useOrganizerQuery()

  const detailQuery = useQuery({
    queryKey: [...raceQueryKey, 'detail', raceId],
    queryFn: ({ signal }) => getRaceDetail(raceId ?? '', signal),
    enabled: Boolean(raceId),
    retry: false,
  })

  const updateMutation = useMutation({
    mutationFn: (status?: string) => updateRace(raceId ?? '', mapFormToRequest(form, status)),
    onSuccess: (updatedRace) => {
      if (updatedRace) {
        setForm({
          ...mapDetailToForm(updatedRace, normalizeCollection(teamQuery.data), normalizeCollection(organizerQuery.data)),
          modifiedAt: getCurrentGmt7InstantString(),
        })
      }
    },
  })

  useEffect(() => {
    if (!detailQuery.data) return
    setForm(mapDetailToForm(detailQuery.data, normalizeCollection(teamQuery.data), normalizeCollection(organizerQuery.data)))
  }, [detailQuery.data, organizerQuery.data, teamQuery.data])

  const updateBasic = (changes: Partial<Pick<EditRaceForm, 'raceName' | 'timeStart' | 'timeEnd' | 'coverUrl' | 'coverFileName' | 'place'>>) => {
    setForm((current) => ({ ...current, ...changes }))
  }

  const updateBooth = (id: string, changes: Partial<EditRaceForm['booths'][number]>) => {
    setForm((current) => ({
      ...current,
      booths: current.booths.map((booth) => booth.id === id ? { ...booth, ...changes } : booth),
    }))
  }

  const removeBooth = (id: string) => {
    setForm((current) => ({ ...current, booths: current.booths.filter((booth) => booth.id !== id) }))
  }

  const addBooth = () => {
    setForm((current) => ({
      ...current,
      booths: [
        ...current.booths,
        {
          id: crypto.randomUUID(),
          name: '',
          place: '',
          managers: [],
          description: '',
        },
      ],
    }))
  }

  const addTeam = (teams: TeamModel[]) => {
    setForm((current) => {
      const nextTeams = teams
        .filter((team) => !current.teams.some((row) => row.id === team.id))
        .map((team) => ({ id: team.id, name: team.name, leaderEmail: team.leaderEmail }))

      return { ...current, teams: [...current.teams, ...nextTeams] }
    })
  }

  const removeTeam = (id: string) => {
    setForm((current) => ({ ...current, teams: current.teams.filter((team) => team.id !== id) }))
  }

  const addOrganizer = (organizers: OrganizerModel[]) => {
    setForm((current) => {
      const nextOrganizers = organizers
        .filter((organizer) => !current.organizers.some((row) => row.id === organizer.id))
        .map((organizer) => ({
          id: organizer.id,
          displayName: organizer.displayName ?? organizer.email,
          email: organizer.email,
        }))

      return { ...current, organizers: [...current.organizers, ...nextOrganizers] }
    })
  }

  const removeOrganizer = (id: string) => {
    setForm((current) => ({ ...current, organizers: current.organizers.filter((organizer) => organizer.id !== id) }))
  }

  const updateSetting = (key: keyof EditRaceForm['settings'], value: boolean) => {
    setForm((current) => ({ ...current, settings: { ...current.settings, [key]: value } }))
  }

  const openImagePicker = () => imageInputRef.current?.click()

  const handleImageSelected = (file?: File) => {
    if (!file) return
    updateBasic({ coverFileName: file.name, coverUrl: URL.createObjectURL(file) })
  }

  const resetForm = () => {
    setForm(detailQuery.data ? mapDetailToForm(detailQuery.data, normalizeCollection(teamQuery.data), normalizeCollection(organizerQuery.data)) : EDIT_RACE_INITIAL_FORM)
    updateMutation.reset()
  }

  const saveRace = (options?: { onSuccess?: () => void; status?: string }) => {
    if (raceId) updateMutation.mutate(options?.status, { onSuccess: options?.onSuccess })
  }

  return {
    detailQuery,
    form,
    imageInputRef,
    isSaving: updateMutation.isPending,
    saveError: updateMutation.error,
    saveRace,
    resetForm,
    updateBasic,
    addBooth,
    updateBooth,
    removeBooth,
    addTeam,
    removeTeam,
    addOrganizer,
    removeOrganizer,
    updateSetting,
    openImagePicker,
    handleImageSelected,
  }
}
