import { useMemo } from 'react'
import type { SearchOption } from '@/core/shared'
import type { TeamModel, TeamSearchMode } from '../../models'

type UseTeamSearchBoxParams = {
  data: any 
  type: TeamSearchMode
  value: TeamModel[]
  onChange: (teams: TeamModel[]) => void
}

export const useTeamSearchBox = ({ data, onChange, type, value }: UseTeamSearchBoxParams) => {
  // 1. Tạo Set lưu trữ các Id đã chọn (Code gốc của team)
  const selectedIds = useMemo(() => new Set(value.map((team) => team.id)), [value])
  
  const safeItems = useMemo<TeamModel[]>(() => {
    const rawList = data?.data ?? data?.items ?? data
    return Array.isArray(rawList) ? rawList : []
  }, [data])

  const options = useMemo<SearchOption[]>(
    () => safeItems
      .filter((team: TeamModel) => !selectedIds.has(team.id)) 
      .map((team: TeamModel) => ({
        id: team.id,
        label: team.name,
        description: team.leaderEmail,
        keywords: [team.leaderEmail],
      })),
    [safeItems, selectedIds], 
  )

  const selectedKey = useMemo(
    () => value.map((team) => team.id).join('|'),
    [value],
  )

  const removeTeam = (team: TeamModel) => {
    onChange(value.filter((item) => item.id !== team.id))
  }

  const selectTeam = (option: SearchOption) => {
    const team = safeItems.find((item: TeamModel) => item.id === option.id)
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