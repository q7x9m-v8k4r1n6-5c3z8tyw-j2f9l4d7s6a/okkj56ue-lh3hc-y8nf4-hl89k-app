import { useOrganizerRaceListState } from '../../model/frontend/useOrganizerRaceListState'
import { useOrganizerRaceListQuery } from '../../model/server/useOrganizerRaceListQuery'

const PAGE_SIZE = 20

/** Combines organizer race-list browser state and server state for rendering. */
export const useOrganizerRaceCollection = () => {
  const state = useOrganizerRaceListState()
  const racesQuery = useOrganizerRaceListQuery({
    page: state.page,
    pageSize: PAGE_SIZE,
  })
  const result = racesQuery.data
  const totalItems = result?.totalItems ?? 0
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
    races: result?.items ?? [],
    setPage: state.setPage,
    summary: {
      startItem: totalItems === 0 ? 0 : (state.page - 1) * pageSize + 1,
      endItem: Math.min(totalItems, state.page * pageSize),
      totalItems,
    },
    totalPages: Math.max(result?.totalPages ?? 1, 1),
  }
}
