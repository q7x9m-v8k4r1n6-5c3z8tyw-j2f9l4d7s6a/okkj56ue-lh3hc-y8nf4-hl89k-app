import { useSearchParams } from 'react-router-dom'
import {
  detailRaceTabs,
  isDetailRaceTab,
  type DetailRaceTab,
} from './detailRace.tabs'

/**
 * Owns presentation-only tab state for the race-detail route.
 * Race data, editing state and mutations remain inside edit-race.
 */
export const useDetailRacePage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawTab = searchParams.get('tab')
  const activeTab: DetailRaceTab = rawTab && isDetailRaceTab(rawTab) ? rawTab : 'basic'
  const activeTabLabel = detailRaceTabs.find(
    (tab) => tab.value === activeTab,
  )?.label ?? 'Nội dung'

  return {
    activeTab,
    activeTabLabel,
    onTabChange: (value: string) => {
      if (!isDetailRaceTab(value)) return
      setSearchParams((current) => {
        current.set('tab', value)
        return current
      })
    },
    tabs: [...detailRaceTabs],
  }
}