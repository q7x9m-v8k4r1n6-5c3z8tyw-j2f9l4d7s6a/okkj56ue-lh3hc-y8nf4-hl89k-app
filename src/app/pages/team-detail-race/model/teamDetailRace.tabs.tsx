import {
  GavelIcon,
  GridMenuIcon,
  LeaderboardIcon,
  MapIcon,
  QrScanIcon,
} from '@/core/assets'
import type { TeamNavItem } from '@/core/shared'

export const teamDetailRaceTabs = [
  { value: 'rules', label: 'Luật trận đấu' },
  { value: 'map', label: 'Bản đồ' },
  { value: 'scan', label: 'Quét mã QR' },
  { value: 'leaderboard', label: 'BXH' },
  { value: 'more', label: 'Khác' },
] as const

export type TeamDetailRaceTab = (typeof teamDetailRaceTabs)[number]['value']
export type TeamPrimaryDetailRaceTab = Exclude<TeamDetailRaceTab, 'more'>

export const teamDetailRaceNavItems: TeamNavItem[] = [
  { id: 'rules', label: 'Luật trận đấu', icon: <GavelIcon /> },
  { id: 'map', label: 'Bản đồ', icon: <MapIcon /> },
  { id: 'scan', label: 'Quét mã QR', icon: <QrScanIcon /> },
  { id: 'leaderboard', label: 'BXH', icon: <LeaderboardIcon /> },
  { id: 'more', label: 'Khác', icon: <GridMenuIcon /> },
]

export const isTeamDetailRaceTab = (value: string): value is TeamDetailRaceTab =>
  teamDetailRaceTabs.some((tab) => tab.value === value)

export const isTeamPrimaryDetailRaceTab = (
  value: TeamDetailRaceTab,
): value is TeamPrimaryDetailRaceTab => value !== 'more'
