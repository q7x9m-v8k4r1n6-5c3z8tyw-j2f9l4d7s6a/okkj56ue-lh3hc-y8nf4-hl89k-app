import { useEffect, useMemo, useState } from 'react'
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import type { UserCategory } from '@/core/entities/user'
import { useToast } from '@/core/shared'
import { setUserEditorTarget } from '../../../model/userEditorSearchParams'

type PageState = {
  activeTab?: UserCategory
  toastMessage?: string
}

const PAGE_SIZE = 20

/** Owns browser-only filters, paging and editor-panel state for user-list. */
export const useUserListState = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { toast } = useToast()
  const locationState = location.state as PageState | null
  const [tab, setTab] = useState<UserCategory>(
    searchParams.get('tab') === 'staff'
      ? 'staff'
      : locationState?.activeTab ?? 'team',
  )
  const [page, setPage] = useState(1)
  const [searchValue, setSearchValue] = useState('')
  const [query, setQuery] = useState('')
  const [searchTooltipOpen, setSearchTooltipOpen] = useState(false)

  const request = useMemo(() => ({
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

  const selectTab = (nextTab: UserCategory) => {
    setTab(nextTab)
    setPage(1)
    setSearchValue('')
    setQuery('')
    setSearchParams((current) => {
      current.set('tab', nextTab)
      return current
    })
  }

  const submitSearch = () => {
    setQuery(searchValue)
    setPage(1)
  }

  const openUserPanel = (
    category: UserCategory,
    mode: 'create' | 'edit',
    userId?: string,
  ) => {
    setSearchParams((current) => setUserEditorTarget(current, {
      category,
      mode,
      userId,
    }))
  }

  return {
    createUser: () => openUserPanel(tab, 'create'),
    editUser: (category: UserCategory, userId: string) =>
      openUserPanel(category, 'edit', userId),
    page,
    request,
    searchTooltipOpen,
    searchValue,
    selectTab,
    setPage,
    setSearchTooltipOpen,
    setSearchValue,
    submitSearch,
    tab,
  }
}
