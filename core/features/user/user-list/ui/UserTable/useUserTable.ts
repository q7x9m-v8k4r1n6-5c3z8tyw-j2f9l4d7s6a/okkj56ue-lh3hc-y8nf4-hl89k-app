import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { UserCategory } from '@/core/entities/user/model'
import { useToast } from '@/core/shared'

type PageState = {
  activeTab?: UserCategory
  toastMessage?: string
}

const PAGE_SIZE = 20

export const getDisplayLabel = (tab: UserCategory) => tab === 'staff' ? 'thành viên' : 'đội chơi'
export const getCreateLabel = (tab: UserCategory) => tab === 'staff' ? 'Tạo Ban Tổ chức' : 'Tạo Đội chơi'
export const getNameHeader = (tab: UserCategory) => tab === 'staff' ? 'Họ và tên' : 'Tên đội chơi'
export const getEmailHeader = (tab: UserCategory) => tab === 'staff' ? 'Email thành viên' : 'Email đội trưởng'
export const getSearchPlaceholder = (tab: UserCategory) => tab === 'staff'
  ? 'Tìm kiếm ban tổ chức ...'
  : 'Tìm kiếm đội chơi ...'
export const getSearchTooltip = (tab: UserCategory) => tab === 'staff'
  ? 'Nhập email hoặc họ và tên để tìm ban tổ chức'
  : 'Nhập tên đội chơi hoặc tên đăng nhập hoặc email đội trưởng để tìm đội chơi'

export const useUserTable = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const locationState = location.state as PageState | null
  const [tab, setTab] = useState<UserCategory>(locationState?.activeTab ?? 'team')
  const [page, setPage] = useState(1)
  const [searchValue, setSearchValue] = useState('')
  const [query, setQuery] = useState('')
  const [searchTooltipOpen, setSearchTooltipOpen] = useState(false)
  const closePanelTimerRef = useRef<number | null>(null)
  const [userPanel, setUserPanel] = useState<{
    category: UserCategory
    mode: 'create' | 'edit'
    userId?: number
  } | null>(null)
  const [userPanelOpen, setUserPanelOpen] = useState(false)

  const payload = useMemo(() => ({
    search: query.trim() || undefined,
    page,
    pageSize: PAGE_SIZE,
  }), [page, query])

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

  useEffect(() => {
    return () => {
      if (closePanelTimerRef.current) window.clearTimeout(closePanelTimerRef.current)
    }
  }, [])

  const selectTab = (nextTab: UserCategory) => {
    setTab(nextTab)
    setPage(1)
    setSearchValue('')
    setQuery('')
  }

  const submitSearch = () => {
    setQuery(searchValue)
    setPage(1)
  }

  const openUserPanel = (panel: NonNullable<typeof userPanel>) => {
    if (closePanelTimerRef.current) window.clearTimeout(closePanelTimerRef.current)

    setUserPanel(panel)
    setUserPanelOpen(false)
    window.requestAnimationFrame(() => setUserPanelOpen(true))
  }

  const closeUserPanel = () => {
    setUserPanelOpen(false)
    closePanelTimerRef.current = window.setTimeout(() => {
      setUserPanel(null)
      closePanelTimerRef.current = null
    }, 300)
  }

  const createUser = () => openUserPanel({ category: tab, mode: 'create' })
  const editUser = (category: UserCategory, userId: number) => openUserPanel({ category, mode: 'edit', userId })

  const notifyDeleteFailed = (category: UserCategory) => {
    toast({ title: 'Thông báo', description: `Không thể xóa ${getDisplayLabel(category)}.` })
  }

  const notifyDeleteSucceeded = (category: UserCategory) => {
    toast({ title: 'Thông báo', description: `Đã xóa ${getDisplayLabel(category)} khỏi danh sách.` })
  }

  return {
    createUser,
    editUser,
    notifyDeleteFailed,
    notifyDeleteSucceeded,
    page,
    payload,
    query,
    searchValue,
    searchTooltipOpen,
    selectTab,
    closeUserPanel,
    setPage,
    setSearchValue,
    setSearchTooltipOpen,
    submitSearch,
    tab,
    userPanel,
    userPanelOpen,
  }
}
