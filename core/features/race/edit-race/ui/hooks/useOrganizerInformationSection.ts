import type { OrganizerSummary } from '@/core/entities/organizer'
import { useEditRaceForm } from '../../model/frontend/useEditRaceForm'

/**
 * Adapts organizer search results to the frontend form model.
 */
export const useOrganizerInformationSection = () => {
  const editor = useEditRaceForm()

  return {
    isEditing: editor.isEditing,
    onAddOrganizers: (organizers: OrganizerSummary[]) => {
      editor.addOrganizers(organizers.map((organizer) => ({
        id: organizer.id,
        displayName: organizer.displayName ?? organizer.email,
        email: organizer.email,
        avatarUrl: organizer.avatarUrl,
      })))
    },
    organizers: editor.form.organizers.map((organizer) => ({
      ...organizer,
      onRemove: () => editor.removeOrganizer(organizer.id),
    })),
  }
}
