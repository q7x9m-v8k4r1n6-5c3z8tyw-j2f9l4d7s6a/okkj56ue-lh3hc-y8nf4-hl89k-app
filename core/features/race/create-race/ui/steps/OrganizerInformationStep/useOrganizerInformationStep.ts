import { useAppDispatch, useAppSelector } from '@/core/shared'
import { createRaceActions } from '@/core/features/race/create-race/stores'
import type { OrganizerModel } from '@/core/entities/organizer'

export const useOrganizerInformationStep = () => {
  const dispatch = useAppDispatch()
  const rows = useAppSelector((state) => state.createRace.organizers)
  const error = useAppSelector((state) => state.createRace.organizerError)

  const addOrganizer = (organizers: OrganizerModel[]) => {
    const organizer = organizers[0]
    if (!organizer || rows.some((row) => row.id === organizer.id || row.email === organizer.email)) return

    dispatch(createRaceActions.addOrganizer({
      id: organizer.id,
      name: organizer.displayName ?? organizer.email,
      email: organizer.email,
    }))
  }

  const removeOrganizer = (id: string) => {
    dispatch(createRaceActions.removeOrganizer(id))
  }

  return {
    addOrganizer,
    error,
    removeOrganizer,
    rows,
  }
}
