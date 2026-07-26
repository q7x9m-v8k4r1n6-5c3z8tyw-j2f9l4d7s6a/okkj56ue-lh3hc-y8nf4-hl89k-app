import { useState } from 'react'
import { EditRaceView } from '@/core/features/race/edit-race'
import { Tabs } from '@/core/shared'
import { DETAIL_RACE_TABS, type DetailRaceTab } from './constants'

export const DetailRaceView = () => {
  const [activeTab, setActiveTab] = useState<DetailRaceTab>('basic')
  const activeTabLabel = DETAIL_RACE_TABS.find((tab) => tab.value === activeTab)?.label ?? 'Nội dung'

  return (
    <main className="flex min-h-[calc(100svh-61px)] flex-1 flex-col bg-white px-5 py-4">
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <Tabs items={[...DETAIL_RACE_TABS]} value={activeTab} onChange={(value) => setActiveTab(value as DetailRaceTab)} />
        <div className="min-h-0 flex-1 overflow-y-auto pb-8">
          {activeTab === 'basic' ? (
            <EditRaceView />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">{activeTabLabel}</div>
          )}
        </div>
      </div>
    </main>
  )
}

export const DetailRacePage = () => <DetailRaceView />
