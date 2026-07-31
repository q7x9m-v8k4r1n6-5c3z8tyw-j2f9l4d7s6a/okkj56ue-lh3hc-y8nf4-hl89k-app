import { PlusIcon, SearchIcon } from '@/core/assets'
import { UserTableRow } from '@/core/entities/user'
import { Button, Modal, Pagination, TableCard } from '@/core/shared'
import { useUserTable } from '../hooks/useUserTable'

/** Renders the management table from a hook-provided view-model. */
export const UserTable = () => {
  const {
    counts,
    createUser,
    editUser,
    errorMessage,
    cancelDelete,
    confirmDelete,
    handleSearchKeyDown,
    hideSearchTooltipLater,
    isError,
    isDeleting,
    isLoading,
    labels,
    page,
    rows,
    searchValue,
    searchTooltipOpen,
    selectTab,
    setPage,
    setSearchValue,
    setSearchTooltipOpen,
    tab,
    totalPages,
    requestDelete,
    userPendingDeletion,
  } = useUserTable()

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-6 shrink-0 px-6">
        <div className="flex h-[60px] items-center justify-between border-b-[3px] border-[#eeeeee]">
          <div className="flex h-full items-end gap-[25px]">
            <button
              type="button"
              className={`-mb-[3px] inline-flex h-[31px] items-start gap-[9px] border-b-[3px] pb-[17px] text-sm leading-[14px] tracking-[0.7px] transition-colors ${tab === 'team' ? 'border-[#de3336] text-[#420001]' : 'border-transparent text-[#1a1c1c] hover:text-[#420001]'}`}
              onClick={() => selectTab('team')}
            >
              <span>Đội chơi</span>
              <span className={`inline-flex w-fit items-center justify-center rounded-lg px-1.5 py-0.5 text-sm leading-[14px] tracking-[0.7px] ${tab === 'team' ? 'bg-[#e71313] text-white' : 'bg-[#f4f4f5] text-[#71717a]'}`}>{counts.team}</span>
            </button>
            <button
              type="button"
              className={`-mb-[3px] inline-flex h-[31px] items-start gap-[9px] border-b-[3px] pb-[17px] text-sm leading-[14px] tracking-[0.7px] transition-colors ${tab === 'staff' ? 'border-[#de3336] text-[#420001]' : 'border-transparent text-[#1a1c1c] hover:text-[#420001]'}`}
              onClick={() => selectTab('staff')}
            >
              <span>Ban tổ chức</span>
              <span className={`inline-flex w-fit items-center justify-center rounded-lg px-1.5 py-0.5 text-sm leading-[14px] tracking-[0.7px] ${tab === 'staff' ? 'bg-[#e71313] text-white' : 'bg-[#f4f4f5] text-[#71717a]'}`}>{counts.staff}</span>
            </button>
          </div>

          <div className="flex h-[34px] items-center gap-2">
            <label className="relative block h-[34px] w-[399px]">
              <span className="sr-only">Tìm kiếm người dùng</span>
              <SearchIcon className="pointer-events-none absolute left-[10px] top-1/2 size-6 -translate-y-1/2 text-[#1a1c1c]" />
              <input
                type="text"
                value={searchValue}
                placeholder={labels.searchPlaceholder}
                className="h-[34px] w-full rounded-lg border-[0.5px] border-[#d4d4d4] bg-white pl-11 pr-3 text-base leading-normal text-[#6b7280] outline-none placeholder:text-[#6b7280] focus:border-[#bdbdbd] focus:ring-2 focus:ring-[#de3336]/10"
                onBlur={hideSearchTooltipLater}
                onChange={(event) => {
                  setSearchValue(event.target.value)
                }}
                onClick={() => setSearchTooltipOpen(true)}
                onFocus={() => setSearchTooltipOpen(true)}
                onKeyDown={handleSearchKeyDown}
              />
              <span className={`pointer-events-none absolute right-0 top-[39px] z-20 rounded-lg bg-[#171717] px-3 py-2 text-center text-xs font-semibold leading-[18px] text-white shadow-[0_12px_8px_rgba(0,0,0,0.08),0_4px_3px_rgba(0,0,0,0.03)] ${searchTooltipOpen ? '' : 'hidden'}`}>
                {labels.searchTooltip}
              </span>
            </label>

            <Button
              size="sm"
              className="h-[34px] min-h-0 px-[10px] py-0 text-sm font-normal leading-[14px] tracking-[0.7px]"
              leadingIcon={<PlusIcon className="size-6" />}
              onClick={createUser}
            >
              {labels.create}
            </Button>
          </div>
        </div>
      </div>

    <TableCard className="px-2 flex min-h-0 w-full flex-1 flex-col rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="h-11 bg-[#fafafa] text-xs font-medium leading-[18px] text-[#525252]">
              <th className="px-6 py-3">{labels.nameHeader}</th>
              {tab === 'team' && <th className="w-[224px] px-6 py-3">Tên đăng nhập</th>}
              <th className="w-[160px] px-6 py-3">Trạng thái</th>
              <th className="w-[224px] px-6 py-3">{labels.emailHeader}</th>
              <th className="w-[112px] px-4 py-3" />
            </tr>
          </thead>
          <tbody className="text-sm leading-5 text-[#525252]">
            {isLoading ? (
              <tr>
                <td colSpan={tab === 'team' ? 5 : 4} className="border-t border-[#f3eeeb] px-5 py-10 text-center text-sm text-[#9d9792]">
                  Đang tải danh sách {labels.display}...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={tab === 'team' ? 5 : 4} className="border-t border-[#f3eeeb] px-5 py-10 text-center text-sm text-[#9d9792]">
                  {errorMessage}
                </td>
              </tr>
            ) : rows.length ? rows.map((row) => (
              <UserTableRow
                key={`${row.category}-${row.id}`}
                user={row}
                onDelete={requestDelete}
                onEdit={(user) => editUser(user.category, user.id)}
              />
            )) : (
              <tr>
                <td colSpan={tab === 'team' ? 5 : 4} className="border-t border-[#f3eeeb] px-5 py-10 text-center text-sm text-[#9d9792]">
                  Không tìm thấy {labels.display} phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={setPage}
      />
    </TableCard>
    <Modal
      open={Boolean(userPendingDeletion)}
      title={`Xóa ${userPendingDeletion?.category === 'team' ? 'đội chơi' : 'thành viên Ban tổ chức'}?`}
      onClose={cancelDelete}
      footer={(
        <>
          <Button variant="secondary" onClick={cancelDelete}>Hủy</Button>
          <Button variant="danger" disabled={isDeleting} onClick={() => void confirmDelete()}>
            {isDeleting ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </>
      )}
    >
      <p className="text-sm text-[#525252]">
        Bạn có chắc chắn muốn xóa <strong>{userPendingDeletion?.displayName}</strong> không?
      </p>
    </Modal>
    </div>
  )
}
