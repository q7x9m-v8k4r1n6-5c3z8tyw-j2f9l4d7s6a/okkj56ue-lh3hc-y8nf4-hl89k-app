import type { KeyboardEvent } from 'react'
import type { UserCategory } from '@/core/entities/user'
import { useToast } from '@/core/shared'
import { useUserListState } from '../../model/frontend/useUserListState'
import { mapUserListToSummaries } from '../../model/mapUserListToSummary'
import { useDeleteUserMutation } from '../../model/server/useDeleteUserMutation'
import {
  useOrganizerListQuery,
  useTeamListQuery,
} from '../../model/server/useUserListQueries'

const getDisplayLabel = (tab: UserCategory) =>
  tab === 'staff' ? 'thành viên' : 'đội chơi'

/** Combines isolated frontend and server models into the table view-model. */
export const useUserTable = () => {
  const state = useUserListState()
  const { toast } = useToast()
  const teamsQuery = useTeamListQuery(state.request, state.tab === 'team')
  const organizersQuery = useOrganizerListQuery(
    state.request,
    state.tab === 'staff',
  )
  const deleteUser = useDeleteUserMutation()
  const activeQuery = state.tab === 'team' ? teamsQuery : organizersQuery
  const rows = mapUserListToSummaries(
    state.tab,
    teamsQuery.data?.items ?? [],
    organizersQuery.data?.items ?? [],
  )

  const handleDelete = async (category: UserCategory, userId: string) => {
    try {
      await deleteUser.mutateAsync({ category, userId })
      toast({
        title: 'Thông báo',
        description: `Đã xóa ${getDisplayLabel(category)} khỏi danh sách.`,
      })
    } catch {
      toast({
        title: 'Thông báo',
        description: `Không thể xóa ${getDisplayLabel(category)}.`,
      })
    }
  }

  const labels = {
    create: state.tab === 'staff' ? 'Tạo Ban Tổ chức' : 'Tạo Đội chơi',
    display: getDisplayLabel(state.tab),
    emailHeader: state.tab === 'staff' ? 'Email thành viên' : 'Email đội trưởng',
    nameHeader: state.tab === 'staff' ? 'Họ và tên' : 'Tên đội chơi',
    searchPlaceholder: state.tab === 'staff'
      ? 'Tìm kiếm ban tổ chức ...'
      : 'Tìm kiếm đội chơi ...',
    searchTooltip: state.tab === 'staff'
      ? 'Nhập email hoặc họ và tên để tìm ban tổ chức'
      : 'Nhập tên đội chơi hoặc tên đăng nhập hoặc email đội trưởng để tìm đội chơi',
  }

  return {
    ...state,
    counts: {
      team: teamsQuery.data?.totalItems ?? 0,
      staff: organizersQuery.data?.totalItems ?? 0,
    },
    errorMessage: activeQuery.error instanceof Error
      ? activeQuery.error.message
      : `Không thể tải danh sách ${labels.display}.`,
    handleDelete,
    handleSearchKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return
      event.preventDefault()
      state.submitSearch()
    },
    hideSearchTooltipLater: () => {
      window.setTimeout(() => state.setSearchTooltipOpen(false), 120)
    },
    isError: activeQuery.isError,
    isLoading: activeQuery.isLoading,
    labels,
    rows,
    totalPages: Math.max(activeQuery.data?.totalPages ?? 1, 1),
  }
}
