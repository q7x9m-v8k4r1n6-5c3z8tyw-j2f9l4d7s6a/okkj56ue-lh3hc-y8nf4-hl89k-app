import { useState } from 'react'
import { EditRaceView } from '@/core/features/race/edit-race'
import { Tabs } from '@/core/shared'
import { DETAIL_RACE_TABS } from '../constants'
import type { DetailRaceTab } from '../models'
import { PlaceholderTab } from './components'

export const DetailRaceView = () => {
  const [activeTab, setActiveTab] = useState<DetailRaceTab>('basic')
  const activeTabLabel = DETAIL_RACE_TABS.find((tab) => tab.value === activeTab)?.label ?? 'Nội dung'

  return (
    <main className="flex min-h-[calc(100svh-61px)] flex-1 flex-col bg-white px-5 py-4">
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <Tabs items={DETAIL_RACE_TABS} value={activeTab} onChange={(value) => setActiveTab(value as DetailRaceTab)} />
        <div className="min-h-0 flex-1 overflow-y-auto pb-8">
          {activeTab === 'basic' ? <EditRaceView /> : <PlaceholderTab label={activeTabLabel} />}
        </div>
      </div>
    </main>
  )
}
