import {
  useMemo,
  useState,
  type MouseEvent,
} from 'react'
import { useDebouncedValue, type SearchOption } from '@/core/shared'
import type { TeamSummary } from '../model/team'
import { useTeamQuery } from '../model/server/useTeamQuery'

export type TeamSearchMode = 'single' | 'multiple'

export type TeamSearchBoxProps = {
  error?: string
  onChange: (teams: TeamSummary[]) => void
  placeholder?: string
  type?: TeamSearchMode
  value?: TeamSummary[]
}

/**
 * Coordinates team search server state and local selection behavior.
 */
export const useTeamSearchBox = ({
  error: validationError,
  onChange,
  placeholder = 'Tìm đội chơi',
  type = 'single',
  value = [],
}: TeamSearchBoxProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebouncedValue(searchQuery)
  const query = useTeamQuery(debouncedSearchQuery)
  const teams = useMemo(() => query.data ?? [], [query.data])
  const selectedIds = useMemo(
    () => new Set(value.map((team) => team.id)),
    [value],
  )
  const options = useMemo<SearchOption[]>(
    () => teams
      .filter((team) => !selectedIds.has(team.id))
      .map((team) => ({
        id: team.id,
        label: team.name,
        description: team.leaderEmail,
        keywords: [team.leaderEmail],
      })),
    [selectedIds, teams],
  )

  /** Adds the selected team according to single or multiple mode. */
  const selectTeam = (option: SearchOption) => {
    const team = teams.find((item) => item.id === option.id)
    if (!team) return
    onChange(type === 'single' ? [team] : [...value, team])
  }

  return {
    emptyText: query.isLoading
      ? 'Đang tải đội chơi...'
      : query.isError
        ? 'Không thể tải danh sách đội chơi'
        : 'Không tìm thấy đội chơi',
    hasValue: value.length > 0,
    onQueryChange: setSearchQuery,
    options,
    queryErrorMessage: query.isError && !validationError
      ? query.error instanceof Error
        ? query.error.message
        : 'Không thể tải danh sách đội chơi'
      : '',
    selectedItems: value.map((team) => ({
      ...team,
      onRemove: (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        onChange(value.filter((item) => item.id !== team.id))
      },
    })),
    selectedKey: value.map((team) => team.id).join('|'),
    selectTeam,
    validationError,
    placeholder,
  }
}
