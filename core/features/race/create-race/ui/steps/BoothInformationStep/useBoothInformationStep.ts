import { useEffect, useRef, useState } from 'react'
import type { OrganizerSummary } from '@/core/entities/organizer'
import type { CreateRaceStationForm } from '../../../model/createRace.form'
import { hasStationContent } from '../../../model/createRace.validation'
import { useCreateRaceForm } from '../../../model/frontend/useCreateRaceForm'

/** Adapts station rows, drawer state and focus behavior for the station step. */
export const useBoothInformationStep = () => {
  type StationInputField = 'name' | 'location';

  const { dispatch, form } = useCreateRaceForm()
  const rows = form.stations
  const errors = form.errors.stations

  const [detailId, setDetailId] = useState<string | null>(null)
  const inputRefs = useRef<Record<string, Partial<Record<StationInputField, HTMLInputElement | null>>>>({})
  const pendingFocusRef = useRef<{ id: string; field: StationInputField } | null>(null)
  const selectedStation = rows.find((row) => row.id === detailId)

  const update = (
    id: string,
    changes: Partial<Omit<CreateRaceStationForm, 'id'>>,
  ) => {
    dispatch({ type: 'stations/update', id, changes })
  }

  const clearError = (id: string, field: 'name' | 'location' | 'managers') => {
    dispatch({ type: 'stations/error/clear', id, field })
  }

  const updateTextField = (id: string, field: StationInputField, value: string) => {
    update(id, { [field]: value })
    if (errors[id]?.[field]) clearError(id, field)
  }

  const createStation = (
    changes: Partial<Omit<CreateRaceStationForm, 'id'>>,
    focusField?: StationInputField,
    allowEmpty = false,
  ) => {
    if (!allowEmpty && !hasStationContent(changes)) return ''

    const id = crypto.randomUUID()

    if (focusField) pendingFocusRef.current = { id, field: focusField }

    dispatch({ type: 'stations/add', station: {
      id, ...{
        name: '',
        location: '',
        managers: [],
        description: '',
        isHidden: false,
      }, ...changes,
    } })

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
      dispatch({ type: 'stations/remove', id: selectedStation.id })
    }

    setDetailId(null)
  }

  const getManagerValue = (row: CreateRaceStationForm): OrganizerSummary[] => {
    return row.managers
  }

  const updateManagers = (
    row: CreateRaceStationForm,
    organizers: OrganizerSummary[],
  ) => {
    update(row.id, { managers: organizers })
    if (errors[row.id]?.managers) clearError(row.id, 'managers')
  }

  const updateHiddenStatus = (id: string, isHidden: boolean) => {
    update(id, { isHidden })
  }

  const createHiddenStation = (isHidden: boolean) => {
    if (isHidden) createStation({ isHidden }, undefined, true)
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
    updateHiddenStatus,
    createHiddenStation,
    setInputRef,
    removeStation: (id: string) => dispatch({ type: 'stations/remove', id }),
  }
}
