import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { isSettingsTab, settingsTabs, type SettingsTab } from './settings.tabs'

/**
 * Owns presentation-only settings tab state and persists it in the URL.
 */
export const useSettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedTab = searchParams.get('tab')
  const activeTab: SettingsTab = requestedTab && isSettingsTab(requestedTab)
    ? requestedTab
    : 'security'

  useEffect(() => {
    if (requestedTab === activeTab) return
    const next = new URLSearchParams(searchParams)
    next.set('tab', activeTab)
    setSearchParams(next, { replace: true })
  }, [activeTab, requestedTab, searchParams, setSearchParams])

  return {
    activeTab,
    onTabChange: (value: string) => {
      if (!isSettingsTab(value)) return
      const next = new URLSearchParams(searchParams)
      next.set('tab', value)
      setSearchParams(next)
    },
    tabs: settingsTabs.map((tab) => ({ ...tab })),
  }
}

