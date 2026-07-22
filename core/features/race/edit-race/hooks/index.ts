import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { OrganizerModel } from '@/core/entities/organizer'
import type { TeamModel } from '@/core/entities/team'
import { raceQueryKey } from '@/core/features/race/constants'
import { EDIT_RACE_INITIAL_FORM } from '../constants'
import { getRaceDetail, updateRace } from '../api'
import type { EditRaceDetailResponse, EditRaceForm, EditRaceOrganizer, EditRaceRequest } from '../models'

const toDateInputValue = (value?: string) => {
  if (!value) return ''
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value.slice(0, 10)
  return parsed.toISOString().slice(0, 10)
}

const toApiDateTime = (value: string) => value.includes('T') ? value : `${value}T00:00:00.000Z`

const createOrganizerFallback = (id: string, index: number): EditRaceOrganizer => ({
  id,
  displayName: `Ban tổ chức ${index + 1}`,
  email: `organizer${index + 1}@move.local`,
})

const createTeamFallback = (id: string, index: number): TeamModel => ({
  id,
  name: `Đội ${index + 1}`,
  leaderEmail: `doi${index + 1}@gmail.com`,
})

const mapDetailToForm = (detail: EditRaceDetailResponse): EditRaceForm => ({
  raceName: detail.raceName || detail.name || EDIT_RACE_INITIAL_FORM.raceName,
  timeStart: toDateInputValue(detail.timeStart) || EDIT_RACE_INITIAL_FORM.timeStart,
  timeEnd: toDateInputValue(detail.timeEnd) || EDIT_RACE_INITIAL_FORM.timeEnd,
  coverUrl: detail.coverUrl ?? '',
  coverFileName: detail.coverUrl ? detail.coverUrl.split('/').pop() ?? '' : '',
  place: detail.place || EDIT_RACE_INITIAL_FORM.place,
  booths: detail.booth?.length ? detail.booth.map((booth, index) => {
    const managerId = booth.organizerID || booth.organizerId || ''

    return {
      id: `${managerId || 'booth'}-${index}`,
      name: booth.name || `Trạm ${index + 1}`,
      place: booth.place || '',
      managerId,
      managerName: managerId ? `Quản trạm ${index + 1}` : '',
      description: booth.description || '',
    }
  }) : EDIT_RACE_INITIAL_FORM.booths,
  teams: detail.raceTeam?.length ? detail.raceTeam.map((team, index) => createTeamFallback(team.teamID || team.teamId || `team-${index + 1}`, index)) : EDIT_RACE_INITIAL_FORM.teams,
  organizers: detail.organizerId?.length ? detail.organizerId.map(createOrganizerFallback) : EDIT_RACE_INITIAL_FORM.organizers,
  settings: {
    isToggledLeaderboard: detail.isToggledLeaderboard ?? EDIT_RACE_INITIAL_FORM.settings.isToggledLeaderboard,
    isHiddenPoint: detail.isHiddenPoint ?? EDIT_RACE_INITIAL_FORM.settings.isHiddenPoint,
  },
})

const mapFormToRequest = (form: EditRaceForm): EditRaceRequest => ({
  raceName: form.raceName,
  timeStart: toApiDateTime(form.timeStart),
  timeEnd: toApiDateTime(form.timeEnd),
  place: form.place,
  coverUrl: form.coverUrl,
  isToggledLeaderboard: form.settings.isToggledLeaderboard,
  isHiddenPoint: form.settings.isHiddenPoint,
  organizerId: form.organizers.map((organizer) => organizer.id),
  raceTeam: form.teams.map((team) => ({ teamID: team.id })),
  booth: form.booths.map((booth) => ({
    name: booth.name,
    place: booth.place,
    description: booth.description,
    organizerID: booth.managerId,
  })),
})

export const useEditRace = (raceId?: string) => {
  const [activeTab, setActiveTab] = useState('basic')
  const [form, setForm] = useState<EditRaceForm>(EDIT_RACE_INITIAL_FORM)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const detailQuery = useQuery({
    queryKey: [...raceQueryKey, 'detail', raceId],
    queryFn: ({ signal }) => getRaceDetail(raceId ?? '', signal),
    enabled: Boolean(raceId),
    retry: false,
  })

  const updateMutation = useMutation({
    mutationFn: () => updateRace(raceId ?? '', mapFormToRequest(form)),
  })

  useEffect(() => {
    if (detailQuery.data) setForm(mapDetailToForm(detailQuery.data))
  }, [detailQuery.data])

  const title = useMemo(() => `Chi tiết: ${form.raceName || 'Trận đấu'}`, [form.raceName])

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
          managerId: '',
          managerName: '',
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

  const saveRace = () => {
    if (raceId) updateMutation.mutate()
  }

  return {
    activeTab,
    detailQuery,
    form,
    imageInputRef,
    isSaving: updateMutation.isPending,
    saveError: updateMutation.error,
    saveRace,
    setActiveTab,
    title,
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
