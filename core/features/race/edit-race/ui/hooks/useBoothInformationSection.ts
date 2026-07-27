import type { ChangeEvent } from 'react'
import type { OrganizerSummary } from '@/core/entities/organizer'
import { useEditRaceForm } from '../../model/frontend/useEditRaceForm'
import type { EditRaceBooth } from '../../model/editRace.form'

const formatManagers = (booth: EditRaceBooth) => {
  if (!booth.managers.length) return 'Chưa có thông tin'
  return booth.managers
    .map((manager) => manager.displayName || manager.email || manager.id)
    .join(', ')
}

const shortenDescription = (description: string) => {
  const value = description || 'Chưa có thông tin'
  return value.length > 28 ? `${value.slice(0, 28)} ...` : value
}

/**
 * Adapts booth form state into table rows and event handlers.
 */
export const useBoothInformationSection = () => {
  const editor = useEditRaceForm()

  return {
    addBooth: editor.addBooth,
    booths: editor.form.booths.map((booth) => ({
      ...booth,
      descriptionText: shortenDescription(booth.description),
      managerText: formatManagers(booth),
      onDescriptionChange: (event: ChangeEvent<HTMLInputElement>) =>
        editor.updateBooth(booth.id, { description: event.target.value }),
      onManagersChange: (managers: OrganizerSummary[]) => {
        editor.updateBooth(booth.id, {
          managers: managers.map((manager) => ({
            id: manager.id,
            displayName: manager.displayName ?? manager.email,
            email: manager.email,
          })),
        })
      },
      onNameChange: (event: ChangeEvent<HTMLInputElement>) =>
        editor.updateBooth(booth.id, { name: event.target.value }),
      onPlaceChange: (event: ChangeEvent<HTMLInputElement>) =>
        editor.updateBooth(booth.id, { place: event.target.value }),
      onRemove: () => editor.removeBooth(booth.id),
    })),
    errors: editor.errors.booths,
    isEditing: editor.isEditing,
  }
}
