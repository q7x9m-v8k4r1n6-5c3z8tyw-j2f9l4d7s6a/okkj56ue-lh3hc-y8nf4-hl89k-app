import { useEffect, useRef, useState } from 'react'
import { hasStationContent } from '@/core/features/race/create-race/helpers'
import { createRaceActions, type StationDraft } from '@/core/features/race/create-race/stores/createRaceSlice'
import { useAppDispatch, useAppSelector } from '@/core/shared'
import type { OrganizerModel } from '@/core/entities'

export const useBoothInformationStep = () => {
  type StationInputField = 'name' | 'location';

  const dispatch = useAppDispatch()
  const rows = useAppSelector((state) => state.createRace.stations)
  const errors = useAppSelector((state) => state.createRace.stationErrors)

  const [detailId, setDetailId] = useState<string | null>(null)
  const inputRefs = useRef<Record<string, Partial<Record<StationInputField, HTMLInputElement | null>>>>({})
  const pendingFocusRef = useRef<{ id: string; field: StationInputField } | null>(null)
  const selectedStation = rows.find((row) => row.id === detailId)

  const update = (id: string, changes: Partial<Omit<StationDraft, 'id'>>) => {
    dispatch(createRaceActions.updateStation({ id, changes }))
  }

  const clearError = (id: string, field: 'name' | 'location' | 'managers') => {
    dispatch(createRaceActions.clearStationError({ id, field }))
  }

  const updateTextField = (id: string, field: StationInputField, value: string) => {
    update(id, { [field]: value })
    if (errors[id]?.[field]) clearError(id, field)
  }

  const createStation = (
    changes: Partial<Omit<StationDraft, 'id'>>,
    focusField?: StationInputField,
    allowEmpty = false,
  ) => {
    if (!allowEmpty && !hasStationContent(changes)) return ''

    const id = crypto.randomUUID()

    if (focusField) pendingFocusRef.current = { id, field: focusField }

    dispatch(createRaceActions.addStationWithId({
      id, ...{
        name: '',
        location: '',
        managers: [],
        description: '',
      }, ...changes
    }))

    return id
  }

  const createStationWithDescription = () => {
    const id = createStation({ description: '<p></p>' }, undefined, true)
    if (id) setDetailId(id)
  }

  const closeDetails = () => {
    if (!selectedStation) {
      setDetailId(null)
      return
    }

    if (!hasStationContent(selectedStation)) {
      dispatch(createRaceActions.removeStation(selectedStation.id))
    }

    setDetailId(null)
  }

  const getManagerValue = (row: StationDraft): OrganizerModel[] => {
    return row.managers
  }

  const updateManagers = (row: StationDraft, organizers: OrganizerModel[]) => {
    update(row.id, { managers: organizers })
    if (errors[row.id]?.managers) clearError(row.id, 'managers')
  }

  const setInputRef = (id: string, field: StationInputField, node: HTMLInputElement | null) => {
    inputRefs.current[id] = { ...inputRefs.current[id], [field]: node }
  }

  useEffect(() => {
    const pendingFocus = pendingFocusRef.current
    if (!pendingFocus) return

    const input = inputRefs.current[pendingFocus.id]?.[pendingFocus.field]
    if (!input) return

    input.focus()
    input.setSelectionRange(input.value.length, input.value.length)
    pendingFocusRef.current = null
  }, [rows])

  return {
    rows,
    errors,
    selectedStation,
    setDetailId,
    update,
    updateTextField,
    createStation,
    createStationWithDescription,
    closeDetails,
    getManagerValue,
    updateManagers,
    setInputRef,
    removeStation: (id: string) => dispatch(createRaceActions.removeStation(id)),
  }
}
