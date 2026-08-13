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
  { value: 'scan', label: 'Quét QR' },
  { value: 'leaderboard', label: 'BXH' },
  { value: 'more', label: 'Khác' },
] as const

export type TeamDetailRaceTab = (typeof teamDetailRaceTabs)[number]['value']

export const teamDetailRaceNavItems: TeamNavItem[] = [
  { id: 'rules', label: 'Luật chơi', icon: <GavelIcon /> },
  { id: 'map', label: 'Bản đồ', icon: <MapIcon /> },
  { id: 'scan', label: 'Quét QR', icon: <QrScanIcon /> },
  { id: 'leaderboard', label: 'BXH', icon: <LeaderboardIcon /> },
  { id: 'more', label: 'Khác', icon: <GridMenuIcon /> },
]

export const isTeamDetailRaceTab = (value: string): value is TeamDetailRaceTab =>
  teamDetailRaceTabs.some((tab) => tab.value === value)