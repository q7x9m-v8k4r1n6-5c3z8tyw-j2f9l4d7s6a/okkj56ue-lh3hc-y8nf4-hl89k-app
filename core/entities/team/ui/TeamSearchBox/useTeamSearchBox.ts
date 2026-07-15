import { useMemo } from 'react'
import type { SearchOption } from '@/core/shared'
import type { TeamModel, TeamSearchMode } from '../../models'
import type { PagedResult } from '@/core/features/user/user-list/api'

type UseTeamSearchBoxParams = {
  data: PagedResult<TeamModel> | undefined
  type: TeamSearchMode
  value: TeamModel[]
  onChange: (teams: TeamModel[]) => void
}

export const useTeamSearchBox = ({ data, onChange, type, value }: UseTeamSearchBoxParams) => {
  const selectedIds = useMemo(() => new Set(value.map((team) => team.id)), [value])
  
  const options = useMemo<SearchOption[]>(
    () => (data?.items ?? []) 
      .filter((team: TeamModel) => !selectedIds.has(team.id)) 
      .map((team: TeamModel) => ({
        id: team.id,
        label: team.name,
        description: team.leaderEmail,
        keywords: [team.leaderEmail],
      })),
    [data?.items, selectedIds], 
  )

  const selectedKey = useMemo(
    () => value.map((team) => team.id).join('|'),
    [value],
  )

  const removeTeam = (team: TeamModel) => {
    onChange(value.filter((item) => item.id !== team.id))
  }

  const selectTeam = (option: SearchOption) => {
    // 🔌 5. Sửa nốt hàm tìm kiếm item được chọn từ mảng data.items
    const team = (data?.items ?? []).find((item: TeamModel) => item.id === option.id)
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