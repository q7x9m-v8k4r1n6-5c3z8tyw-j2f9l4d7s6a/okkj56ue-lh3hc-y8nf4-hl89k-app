import { RaceIcon, SettingsIcon, UsersIcon } from '@/core/assets'
import type { NavigationItem } from '@/core/shared/types'

export const navigationConfig: Record<string, NavigationItem> = {
  raceList: {
    label: 'Danh sách trận đấu',
    title: 'Danh sách trận đấu',
    to: '/',
    icon: RaceIcon,
    iconClassName: 'h-4 w-[26px]',
  },
  users: {
    label: 'Người dùng',
    title: 'Người dùng',
    to: '/users',
    icon: UsersIcon,
    iconClassName: 'size-[18px]',
  },
  settings: {
    label: 'Cài đặt',
    title: 'Cài đặt',
    to: '/settings',
    icon: SettingsIcon,
    iconClassName: 'size-[18px]',
  },
  prototype: {
    label: 'Common UI Prototype',
    title: 'Common UI Prototype',
    to: '/prototype',
    icon: SettingsIcon,
    iconClassName: 'size-[18px]',
    hidden: true,
  },
}
