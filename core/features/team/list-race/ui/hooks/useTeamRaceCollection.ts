import { useAuthSession } from '@/core/features/auth'
import { isTeamRaceVisible } from '@/core/features/team/team-race'
import { useTeamRaceListState } from '../../model/frontend/useTeamRaceListState'
import { useTeamRaceListQuery } from '../../model/server/useTeamRaceListQuery'

const PAGE_SIZE = 20

/** Combines team race-list browser state and server state for rendering. */
export const useTeamRaceCollection = () => {
  const auth = useAuthSession()
  const state = useTeamRaceListState()
  const racesQuery = useTeamRaceListQuery({
    page: state.page,
    pageSize: PAGE_SIZE,
  }, {
    enabled: Boolean(auth.user?.id),
  })
  const result = racesQuery.data
  const races = (result?.items ?? []).filter(isTeamRaceVisible)
  const totalItems = races.length
  const pageSize = result?.pageSize ?? PAGE_SIZE

  return {
    errorMessage: racesQuery.error instanceof Error
      ? racesQuery.error.message
      : 'Không thể tải danh sách trận đấu.',
    isError: racesQuery.isError,
    isLoading: racesQuery.isPending,
    isRaceSelectable: state.isRaceSelectable,
    openRaceDetail: state.openRaceDetail,
    page: state.page,
    races,
    setPage: state.setPage,
    summary: {
      startItem: totalItems === 0 ? 0 : (state.page - 1) * pageSize + 1,
      endItem: Math.min(totalItems, state.page * pageSize),
      totalItems,
    },
    totalPages: Math.max(result?.totalPages ?? 1, 1),
  }
}
