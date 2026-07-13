import { useMemo } from 'react'
import type { SearchOption } from '@/core/shared'
import type { TeamModel, TeamSearchMode } from '../../models'

type UseTeamSearchBoxParams = {
  data: TeamModel[]
  type: TeamSearchMode
  value: TeamModel[]
  onChange: (teams: TeamModel[]) => void
}

export const useTeamSearchBox = ({ data, onChange, type, value }: UseTeamSearchBoxParams) => {
  const selectedIds = useMemo(() => new Set(value.map((team) => team.id)), [value])
  const options = useMemo<SearchOption[]>(
    () => data
      .filter((team) => !selectedIds.has(team.id))
      .map((team) => ({
        id: team.id,
        label: team.name,
        description: team.leaderEmail,
        keywords: [team.leaderEmail],
      })),
    [data, selectedIds],
  )

  const selectedKey = useMemo(
    () => value.map((team) => team.id).join('|'),
    [value],
  )

  const removeTeam = (team: TeamModel) => {
    onChange(value.filter((item) => item.id !== team.id))
  }

  const selectTeam = (option: SearchOption) => {
    const team = data.find((item) => item.id === option.id)
    if (!team) return

    onChange(type === 'single' ? [team] : [...value, team])
  }

  return {
    hasValue: value.length > 0,
    options,
    removeTeam,
    selectedKey,
    selectTeam,
  }
}
