import {
  GavelIcon,
  GridMenuIcon,
  LeaderboardIcon,
  MapIcon,
  QrScanIcon,
} from '@/core/assets'
import type { TeamNavItem } from '@/core/shared'

export const teamDetailRaceTabs = [
  { value: 'rules', label: 'Luật chơi' },
  { value: 'map', label: 'Bản đồ' },
  { value: 'scan', label: 'Quét mã QR' },
  { value: 'leaderboard', label: 'Kết quả' },
  { value: 'more', label: 'Khác' },
  { value: 'announcement-history', label: 'Lịch sử thông báo' },
  { value: 'menu', label: 'Menu' },
] as const

export type TeamDetailRaceTab = (typeof teamDetailRaceTabs)[number]['value']

export type TeamPrimaryRaceTab = Exclude<
  TeamDetailRaceTab,
  'announcement-history' | 'menu'
>

export const teamDetailRaceNavItems: TeamNavItem[] = [
  { id: 'rules', label: 'Luật chơi', icon: <GavelIcon /> },
  { id: 'map', label: 'Bản đồ', icon: <MapIcon /> },
  { id: 'scan', label: 'Quét mã QR', icon: <QrScanIcon /> },
  { id: 'leaderboard', label: 'Kết quả', icon: <LeaderboardIcon /> },
  { id: 'more', label: 'Khác', icon: <GridMenuIcon /> },
]

export const isTeamDetailRaceTab = (value: string): value is TeamDetailRaceTab =>
  teamDetailRaceTabs.some((tab) => tab.value === value)

export const isTeamPrimaryRaceTab = (
  value: TeamDetailRaceTab,
): value is TeamPrimaryRaceTab => value !== 'announcement-history' && value !== 'menu'
