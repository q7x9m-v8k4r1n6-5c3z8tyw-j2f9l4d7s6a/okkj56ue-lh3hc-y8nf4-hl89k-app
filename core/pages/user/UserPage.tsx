import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { EditIcon, PlusIcon, SearchIcon, TrashIcon } from '@/core/assets'
import { MoveButton, MoveDotStatus, MoveIconButton, MovePagination, MovePanel, useToast } from '@/core/shared'
import { deleteUserRecord, getUserRecords, type UserCategory } from '@/core/shared/lib'

type PageState = {
  activeTab?: UserCategory
  toastMessage?: string
}

const PAGE_SIZE = 20

const getDisplayLabel = (tab: UserCategory) => tab === 'staff' ? 'thành viên' : 'đội chơi'
const getCreateLabel = (tab: UserCategory) => tab === 'staff' ? 'Tạo Ban tổ chức' : 'Tạo Đội chơi'
const getNameHeader = (tab: UserCategory) => tab === 'staff' ? 'Họ và tên' : 'Tên đội chơi'
const getEmailHeader = (tab: UserCategory) => tab === 'staff' ? 'Email thành viên' : 'Email đội trưởng'
const getSearchPlaceholder = (tab: UserCategory) => tab === 'staff'
  ? 'Nhập email hoặc họ và tên để tìm kiếm ...'
  : 'Nhập tên đội hoặc email để tìm kiếm ...'
const getSearchTooltip = (tab: UserCategory) => tab === 'staff'
  ? 'Nhập email hoặc họ và tên để lọc nhanh.'
  : 'Nhập tên đội, username hoặc email để lọc nhanh.'

export const UserPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const locationState = location.state as PageState | null
  const [tab, setTab] = useState<UserCategory>(locationState?.activeTab ?? 'team')
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [searchTooltipOpen, setSearchTooltipOpen] = useState(false)
  const [rows, setRows] = useState(() => getUserRecords())

  useEffect(() => {
    if (locationState?.toastMessage) {
      toast({
        title: 'Thông báo',
        description: locationState.toastMessage,
      })
    }

    if (locationState?.activeTab || locationState?.toastMessage) {
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.pathname, locationState, navigate, toast])

  const counts = useMemo(() => rows.reduce((result, row) => {
    result[row.category] += 1
    return result
  }, { team: 0, staff: 0 }), [rows])

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const scopedRows = rows.filter((row) => row.category === tab)

    if (!normalizedQuery) return scopedRows

    return scopedRows.filter((row) => [row.displayName, row.username, row.email].join(' ').toLowerCase().includes(normalizedQuery))
  }, [query, rows, tab])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)

  const visibleRows = useMemo(() => {
    const startIndex = (safePage - 1) * PAGE_SIZE
    return filteredRows.slice(startIndex, startIndex + PAGE_SIZE)
  }, [filteredRows, safePage])

  return (
    <main className="flex-1 px-4 py-4 sm:px-6 sm:py-4">
      <section aria-labelledby="user-heading" className="w-full">
        <MovePanel>
          <div className="border-b border-[#f1ebe8] px-5 py-3.5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className={`inline-flex items-center gap-2 border-b-2 pb-2 text-[0.76rem] font-medium transition-colors ${tab === 'team' ? 'border-[#ef4444] text-[#1f1f22] font-semibold' : 'border-transparent text-[#8f8782] hover:text-[#4a4542]'}`}
                  onClick={() => {
                    setTab('team')
                    setPage(1)
                    setQuery('')
                  }}
                >
                  <span>Đội chơi</span>
                  <span className="inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-[#fee2e2] px-1.5 py-0.5 text-[0.62rem] font-bold leading-none text-[#dc2626]">{counts.team}</span>
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center gap-2 border-b-2 pb-2 text-[0.76rem] font-medium transition-colors ${tab === 'staff' ? 'border-[#ef4444] text-[#1f1f22] font-semibold' : 'border-transparent text-[#8f8782] hover:text-[#4a4542]'}`}
                  onClick={() => {
                    setTab('staff')
                    setPage(1)
                    setQuery('')
                  }}
                >
                  <span>Ban tổ chức</span>
                  <span className="inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-[#f4f4f5] px-1.5 py-0.5 text-[0.62rem] font-bold leading-none text-[#71717a]">{counts.staff}</span>
                </button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <label className="relative block w-full sm:w-[18.25rem]">
                  <span className="sr-only">Tìm kiếm người dùng</span>
                  <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a7a09b]" />
                  <input
                    type="search"
                    value={query}
                    placeholder={getSearchPlaceholder(tab)}
                    className="w-full rounded-lg border border-[#ebe4e0] bg-white py-2 pl-9 pr-3 text-[0.76rem] font-medium text-[#6a6663] outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/12"
                    onBlur={() => window.setTimeout(() => setSearchTooltipOpen(false), 120)}
                    onChange={(event) => {
                      setQuery(event.target.value)
                      setPage(1)
                    }}
                    onClick={() => setSearchTooltipOpen(true)}
                    onFocus={() => setSearchTooltipOpen(true)}
                  />
                  <span className={`pointer-events-none absolute left-0 top-[calc(100%+0.45rem)] rounded-lg border border-[#d7e7ff] bg-white px-3 py-2 text-xs font-medium text-[#2457a6] shadow-[0_12px_22px_rgba(59,130,246,0.12)] ${searchTooltipOpen ? '' : 'hidden'}`}>
                    {getSearchTooltip(tab)}
                  </span>
                </label>

                <MoveButton
                  size="sm"
                  leadingIcon={<PlusIcon className="h-4 w-4" />}
                  onClick={() => navigate(tab === 'staff' ? '/users/staff/new' : '/users/teams/new')}
                >
                  {getCreateLabel(tab)}
                </MoveButton>
              </div>
            </div>
          </div>

          <div className="max-h-[34rem] overflow-x-auto overflow-y-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-[0.63rem] font-semibold text-[#a59d98]">
                  <th className="w-10 px-5 py-3" />
                  <th className="px-5 py-3">{getNameHeader(tab)}</th>
                  <th className="px-5 py-3">Tên đăng nhập</th>
                  <th className="px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3">{getEmailHeader(tab)}</th>
                  <th className="w-24 px-5 py-3" />
                </tr>
              </thead>
              <tbody className="text-sm text-[#4a4542]">
                {visibleRows.length ? visibleRows.map((row) => (
                  <tr className="border-t border-[#f3eeeb]" key={`${row.category}-${row.id}`}>
                    <td className="border-t border-[#f3eeeb] px-5 py-3.5">
                      <input type="checkbox" className="h-4 w-4 rounded border-[#ddd6d2]" />
                    </td>
                    <td className="border-t border-[#f3eeeb] px-5 py-3.5 text-sm font-medium text-[#333136]">{row.displayName}</td>
                    <td className="border-t border-[#f3eeeb] px-5 py-3.5 text-sm text-[#7b746f]">{row.username}</td>
                    <td className="border-t border-[#f3eeeb] px-5 py-3.5"><MoveDotStatus status={row.status} /></td>
                    <td className="border-t border-[#f3eeeb] px-5 py-3.5 text-sm text-[#7b746f]">{row.email}</td>
                    <td className="border-t border-[#f3eeeb] px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2 text-[#8b8580]">
                        <MoveIconButton
                          aria-label={`Xóa ${row.displayName}`}
                          icon={<TrashIcon className="h-4 w-4" />}
                          onClick={() => {
                            if (!deleteUserRecord(row.category, row.id)) {
                              toast({ title: 'Thông báo', description: `Không thể xóa ${getDisplayLabel(row.category)}.` })
                              return
                            }

                            setRows(getUserRecords())
                            toast({ title: 'Thông báo', description: `Đã xóa ${getDisplayLabel(row.category)} khỏi danh sách.` })
                          }}
                        />
                        <MoveIconButton
                          aria-label={`Chỉnh sửa ${row.displayName}`}
                          icon={<EditIcon className="h-4 w-4" />}
                          onClick={() => navigate(row.category === 'staff' ? `/users/staff/${row.id}/edit` : `/users/teams/${row.id}/edit`)}
                        />
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="border-t border-[#f3eeeb] px-5 py-10 text-center text-sm text-[#9d9792]">
                      Không tìm thấy {getDisplayLabel(tab)} phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <MovePagination
            page={safePage}
            pageSize={PAGE_SIZE}
            totalItems={filteredRows.length}
            totalPages={totalPages}
            onChange={setPage}
          />
        </MovePanel>
      </section>
    </main>
  )
}
