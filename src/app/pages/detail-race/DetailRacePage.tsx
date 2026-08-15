import { BuildMapRaceView } from '@/core/features/race/build-map'
import { EditRaceView } from '@/core/features/race/edit-race'
import { LiveRaceView } from '@/core/features/race/live-race'
import { Tabs } from '@/core/shared'
import { useDetailRacePage } from './model/useDetailRacePage'

/**
 * Composes race-detail sections while domain state stays in each feature.
 */
export const DetailRacePage = () => {
  const {
    activeTab,
    activeTabLabel,
    onTabChange,
    tabs,
  } = useDetailRacePage()

  return (
    <main className="flex min-h-[calc(100svh-61px)] flex-1 flex-col bg-white px-5 py-4">
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <Tabs items={tabs} value={activeTab} onChange={onTabChange} />
        <div className="min-h-0 flex-1 overflow-y-auto pb-8">
          {activeTab === 'basic' && <EditRaceView />}
          {activeTab === 'map' && <BuildMapRaceView />}
          {activeTab === 'live' && <LiveRaceView />}
          {activeTab !== 'basic' && activeTab !== 'map' && activeTab !== 'live' && (
            <div className="flex h-full items-center justify-center text-gray-400">
              {activeTabLabel}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}