import {
  BookIcon,
  ClipboardCheckIcon,
  HistoryIcon,
} from '@/core/assets'
import type { OrganizerNavItem } from '@/core/shared'

export const organizerRaceTabs = [
  { value: 'rules', label: 'Luật trận đấu' },
  { value: 'requests', label: 'Yêu cầu tham gia' },
  { value: 'history', label: 'Lịch sử' },
  { value: 'announcement-history', label: 'Lịch sử thông báo' },
  { value: 'menu', label: 'Khác' },
] as const

export type OrganizerRaceTab = (typeof organizerRaceTabs)[number]['value']
export type OrganizerPrimaryRaceTab = Exclude<OrganizerRaceTab, 'announcement-history' | 'menu'>

export const organizerRaceNavItems: OrganizerNavItem[] = [
  { id: 'rules', label: 'Luật trận đấu', icon: <BookIcon /> },
  { id: 'requests', label: 'Yêu cầu tham gia', icon: <ClipboardCheckIcon /> },
  { id: 'history', label: 'Lịch sử', icon: <HistoryIcon /> },
]

export const isOrganizerRaceTab = (value: string): value is OrganizerRaceTab =>
  organizerRaceTabs.some((tab) => tab.value === value)

export const isOrganizerPrimaryRaceTab = (
  value: OrganizerRaceTab,
): value is OrganizerPrimaryRaceTab => value !== 'announcement-history' && value !== 'menu'
