import {
  useMemo,
  useState,
  type MouseEvent,
} from 'react'
import { useDebouncedValue, type SearchOption } from '@/core/shared'
import type { OrganizerSummary } from '../model/organizer'
import { useOrganizerQuery } from '../model/server/useOrganizerQuery'

export type OrganizerSearchMode = 'single' | 'multiple'

export type OrganizerSearchBoxProps = {
  error?: string
  onChange: (organizers: OrganizerSummary[]) => void
  placeholder?: string
  type?: OrganizerSearchMode
  value?: OrganizerSummary[]
}

/**
 * Coordinates organizer search server state and local selection behavior.
 */
export const useOrganizerSearchBox = ({
  error: validationError,
  onChange,
  placeholder = 'Tìm quản trạm',
  type = 'single',
  value = [],
}: OrganizerSearchBoxProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebouncedValue(searchQuery)
  const query = useOrganizerQuery(debouncedSearchQuery)
  const organizers = useMemo(() => query.data ?? [], [query.data])
  const selectedIds = useMemo(
    () => new Set(value.map((organizer) => organizer.id)),
    [value],
  )
  const options = useMemo<SearchOption[]>(
    () => organizers
      .filter((organizer) => !selectedIds.has(organizer.id))
      .map((organizer) => ({
        id: organizer.id,
        label: organizer.displayName ?? organizer.email,
      })),
    [organizers, selectedIds],
  )

  /** Adds the selected organizer according to single or multiple mode. */
  const selectOrganizer = (option: SearchOption) => {
    const organizer = organizers.find((item) => item.id === option.id)
    if (!organizer) return
    onChange(type === 'single' ? [organizer] : [...value, organizer])
  }

  return {
    emptyText: query.isLoading
      ? 'Đang tải quản trạm...'
      : query.isError
        ? 'Không thể tải danh sách quản trạm'
        : 'Không tìm thấy quản trạm',
    hasValue: value.length > 0,
    onQueryChange: setSearchQuery,
    options,
    queryErrorMessage: query.isError && !validationError
      ? query.error instanceof Error
        ? query.error.message
        : 'Không thể tải danh sách quản trạm'
      : '',
    selectedItems: value.map((organizer) => ({
      ...organizer,
      label: organizer.displayName ?? organizer.email,
      onRemove: (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        onChange(value.filter((item) => item.id !== organizer.id))
      },
    })),
    selectedKey: value.map((organizer) => organizer.id).join('|'),
    selectOrganizer,
    validationError,
    placeholder,
  }
}
