import { useAuthSession } from '@/core/features/auth'
import { isOrganizerRaceVisible } from '@/core/features/organizer/organizer-race'
import { useOrganizerRaceListState } from '../../model/frontend/useOrganizerRaceListState'
import { useOrganizerRaceListQuery } from '../../model/server/useOrganizerRaceListQuery'

const PAGE_SIZE = 20

/** Combines organizer race-list browser state and server state for rendering. */
export const useOrganizerRaceCollection = () => {
  const auth = useAuthSession()
  const state = useOrganizerRaceListState()
  const racesQuery = useOrganizerRaceListQuery({
    page: state.page,
    pageSize: PAGE_SIZE,
    participantView: true,
  }, {
    enabled: Boolean(auth.user?.id),
  })
  const result = racesQuery.data
  const races = (result?.items ?? []).filter(isOrganizerRaceVisible)
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
