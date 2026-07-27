import { useRaceListState } from '../../model/frontend/useRaceListState'
import { useRaceListQuery } from '../../model/server/useRaceListQuery'

const PAGE_SIZE = 20

/** Combines race-list browser state and server state into a render-ready model. */
export const useRaceCollection = () => {
  const state = useRaceListState()
  const { page } = state
  const racesQuery = useRaceListQuery({ page, pageSize: PAGE_SIZE })
  const result = racesQuery.data
  const totalItems = result?.totalItems ?? 0
  const pageSize = result?.pageSize ?? PAGE_SIZE

  return {
    errorMessage: racesQuery.error instanceof Error
      ? racesQuery.error.message
      : 'Không thể tải danh sách trận đấu.',
    isError: racesQuery.isError,
    isLoading: racesQuery.isPending,
    openRaceDetail: state.openRaceDetail,
    page,
    races: result?.items ?? [],
    setPage: state.setPage,
    summary: {
      startItem: totalItems === 0 ? 0 : (page - 1) * pageSize + 1,
      endItem: Math.min(totalItems, page * pageSize),
      totalItems,
    },
    totalPages: Math.max(result?.totalPages ?? 1, 1),
  }
}
