import { useEffect, useRef, useState } from 'react'
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
  const value = description
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim() || 'Chưa có thông tin'
  return value.length > 28 ? `${value.slice(0, 28)} ...` : value
}

const hasBoothContent = (booth: EditRaceBooth) => (
  Boolean(
    booth.name.trim() ||
    booth.place.trim() ||
    booth.managers.length ||
    booth.description.replace(/<[^>]*>/g, '').trim(),
  )
)

/**
 * Adapts booth form state into table rows and event handlers.
 */
export const useBoothInformationSection = () => {
  const editor = useEditRaceForm()
  const [detailId, setDetailId] = useState<string | null>(null)
  const inputRefs = useRef<Record<string, Partial<Record<'name' | 'place', HTMLInputElement | null>>>>({})
  const pendingFocusRef = useRef<{ id: string; field: 'name' | 'place' } | null>(null)
  const selectedBooth = editor.form.booths.find((booth) => booth.id === detailId)

  useEffect(() => {
    const pendingFocus = pendingFocusRef.current
    if (!pendingFocus) return

    const input = inputRefs.current[pendingFocus.id]?.[pendingFocus.field]
    if (!input) return

    input.focus()
    input.setSelectionRange(input.value.length, input.value.length)
    pendingFocusRef.current = null
  }, [editor.form.booths])

  const createBooth = (
    changes: Partial<Omit<EditRaceBooth, 'id'>>,
    focusField?: 'name' | 'place',
  ) => {
    const id = editor.addBooth(changes)
    if (focusField) pendingFocusRef.current = { id, field: focusField }
  }

  const createBoothWithDescription = () => {
    const id = editor.addBooth({ description: '<p></p>' })
    setDetailId(id)
  }

  const closeDetails = () => {
    if (selectedBooth && !hasBoothContent(selectedBooth)) {
      editor.removeBooth(selectedBooth.id)
    }
    setDetailId(null)
  }

  return {
    createBooth,
    createBoothWithDescription,
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
            avatarUrl: manager.avatarUrl,
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
    closeDetails,
    openDetails: setDetailId,
    selectedBooth,
    setInputRef: (
      id: string,
      field: 'name' | 'place',
      node: HTMLInputElement | null,
    ) => {
      inputRefs.current[id] = { ...inputRefs.current[id], [field]: node }
    },
    updateSelectedDescription: (description: string) => {
      if (selectedBooth) {
        editor.updateBooth(selectedBooth.id, { description })
      }
    },
  }
}
