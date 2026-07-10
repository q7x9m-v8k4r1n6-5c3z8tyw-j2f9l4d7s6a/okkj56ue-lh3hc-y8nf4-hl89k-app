import { RaceIcon, SettingsIcon, UsersIcon } from '../../assets'
import type { NavigationItem } from '../types'

export const navigationConfig = {
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
} satisfies Record<string, NavigationItem>
