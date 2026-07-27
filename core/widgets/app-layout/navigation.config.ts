import type { ComponentType } from 'react'
import {
  RaceIcon,
  SettingsIcon,
  UsersIcon,
  type IconProps,
} from '@/core/assets'

type NavigationItem = {
  label: string
  title: string
  to: string
  icon: ComponentType<IconProps>
  iconClassName: string
  hidden?: boolean
}

/** Defines the navigation entries rendered by the application layout. */
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
