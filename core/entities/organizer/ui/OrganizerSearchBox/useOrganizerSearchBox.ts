import { useMemo } from 'react'
import type { SearchOption } from '@/core/shared'
import type { OrganizerModel, OrganizerSearchMode } from '../../models'

type UseOrganizerSearchBoxParams = {
  data: OrganizerModel[]
  type: OrganizerSearchMode
  value: OrganizerModel[]
  onChange: (organizers: OrganizerModel[]) => void
}

export const useOrganizerSearchBox = ({ data, onChange, type, value }: UseOrganizerSearchBoxParams) => {

  const selectedIds = useMemo(() => new Set(value.map((organizer) => organizer.id)), [value])
  const options = useMemo<SearchOption[]>(
    () => data
      .filter((organizer) => !selectedIds.has(organizer.id))
      .map((organizer) => ({ id: organizer.id, label: organizer.displayName ?? organizer.email })),
    [data, selectedIds],
  )

  const selectedKey = useMemo(
    () => value.map((organizer) => organizer.id).join('|'),
    [value],
  )

  const removeOrganizer = (organizer: OrganizerModel) => {
    onChange(value.filter((item) => item.id !== organizer.id))
  }

  const selectOrganizer = (option: SearchOption) => {
    const organizer = data.find((item) => item.id === option.id)
    if (!organizer) return

    onChange(type === 'single' ? [organizer] : [...value, organizer])
  }

  return {
    hasValue: value.length > 0,
    options,
    removeOrganizer,
    selectedKey,
    selectOrganizer,
  }
}
