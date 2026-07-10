import { Outlet, useLocation } from 'react-router-dom'
import { AppLayout, type SidebarNavigationItem } from '@core/shared'

const navigationItems: SidebarNavigationItem[] = [
  {
    end: true,
    icon: 'race',
    label: 'Danh sách trận đấu',
    to: '/',
  },
  {
    icon: 'users',
    label: 'Người dùng',
    to: '/users',
  },
  {
    icon: 'settings',
    label: 'Cài đặt',
    to: '/settings',
  },
]

const user = {
  email: 'admin@university.edu',
  name: 'Nguyễn Văn A',
  role: 'Ban Tổ chức',
}

export const Move2026AppShell = () => {
  const { pathname } = useLocation()
  const title = navigationItems.find((item) => (item.end ? pathname === item.to : pathname.startsWith(item.to)))?.label

  return (
    <AppLayout brand="Move" navigationItems={navigationItems} title={title ?? 'MOVE'} user={user}>
      <Outlet />
    </AppLayout>
  )
}
