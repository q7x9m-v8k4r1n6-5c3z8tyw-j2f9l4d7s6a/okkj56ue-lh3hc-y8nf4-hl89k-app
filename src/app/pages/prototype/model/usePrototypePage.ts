import { useState } from 'react'
import { useToast, type SearchOption } from '@/core/shared'

/**
 * Owns presentation-only interaction state for the development UI showcase.
 */
export const usePrototypePage = () => {
  const { toast } = useToast()
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState('teams')
  const [role, setRole] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedSearch, setSelectedSearch] = useState<SearchOption | null>(
    null,
  )

  return {
    closeDrawer: () => setDrawerOpen(false),
    closeModal: () => setModalOpen(false),
    drawerOpen,
    modalOpen,
    notifyError: () => toast({
      title: 'Có lỗi xảy ra',
      description: 'Không thể hoàn tất thao tác. Vui lòng thử lại.',
      variant: 'danger',
    }),
    notifySuccess: () => toast({
      title: 'Cập nhật thành công',
      description: 'Dữ liệu đã được lưu vào hệ thống.',
      variant: 'success',
    }),
    onPageChange: setPage,
    onRoleChange: setRole,
    onSearchSelect: setSelectedSearch,
    onTabChange: setTab,
    openDrawer: () => setDrawerOpen(true),
    openModal: () => setModalOpen(true),
    page,
    role,
    selectedSearch,
    tab,
  }
}
