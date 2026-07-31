import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<DetailRaceTab>(
    initialTab && isDetailRaceTab(initialTab) ? initialTab : 'basic',
  )
  const activeTabLabel = detailRaceTabs.find(
    (tab) => tab.value === activeTab,
  )?.label ?? 'Nội dung'

  return {
    activeTab,
    activeTabLabel,
    onTabChange: (value: string) => {
      if (!isDetailRaceTab(value)) return
      setActiveTab(value)
      setSearchParams((current) => {
        current.set('tab', value)
        return current
      })
    },
    tabs: [...detailRaceTabs],
  }
}
