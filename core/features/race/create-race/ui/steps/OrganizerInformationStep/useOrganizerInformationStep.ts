import type { OrganizerSummary } from '@/core/entities/organizer'
import { useCreateRaceForm } from '../../../model/frontend/useCreateRaceForm'

/** Adapts selected organizers for the organizer step. */
export const useOrganizerInformationStep = () => {
  const { dispatch, form } = useCreateRaceForm()
  const rows = form.organizers
  const error = form.errors.organizer

  const addOrganizer = (organizers: OrganizerSummary[]) => {
    const organizer = organizers[0]
    if (!organizer || rows.some((row) => row.id === organizer.id || row.email === organizer.email)) return

    dispatch({ type: 'organizers/add', organizer })
  }

  const removeOrganizer = (id: string) => {
    dispatch({ type: 'organizers/remove', id })
  }

  return {
    addOrganizer,
    error,
    removeOrganizer,
    rows,
  }
}
