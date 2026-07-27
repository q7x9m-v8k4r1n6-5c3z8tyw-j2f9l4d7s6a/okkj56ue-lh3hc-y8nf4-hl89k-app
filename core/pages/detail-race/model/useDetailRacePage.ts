import { useState } from 'react'
import {
  detailRaceTabs,
  isDetailRaceTab,
  type DetailRaceTab,
} from './detailRace.tabs'

/**
 * Owns presentation-only tab state for the race-detail route.
 *
 * Race data, editing state and mutations remain inside edit-race.
 */
export const useDetailRacePage = () => {
  const [activeTab, setActiveTab] = useState<DetailRaceTab>('basic')
  const activeTabLabel = detailRaceTabs.find(
    (tab) => tab.value === activeTab,
  )?.label ?? 'Nội dung'

  return {
    activeTab,
    activeTabLabel,
    onTabChange: (value: string) => {
      if (isDetailRaceTab(value)) setActiveTab(value)
    },
    tabs: [...detailRaceTabs],
  }
}
