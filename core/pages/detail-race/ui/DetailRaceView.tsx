import { EditRaceView } from '@/core/features/race/edit-race'
import { LiveRaceView } from '@/core/features/race/view-race/ui'
import { Tabs } from '@/core/shared'
import { DETAIL_RACE_TABS } from '../constants'
import { useDetailRace } from '../hooks'
import type { DetailRaceTab } from '../models'
import { PlaceholderTab, RaceDetailRibbon } from './components'

type DetailRaceViewProps = {
  raceId?: string
}

export const DetailRaceView = ({ raceId }: DetailRaceViewProps) => {
  const {
    activeTab,
    activeTabLabel,
    editRace,
    handleEnd,
    handlePause,
    handlePublish,
    handleResume,
    handleSave,
    handleStart,
    isEditing,
    setActiveTab,
    setIsEditing,
  } = useDetailRace(raceId)

  return (
    <main className="flex min-h-[calc(100svh-61px)] flex-1 flex-col bg-white px-5 py-4">
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <Tabs items={DETAIL_RACE_TABS} value={activeTab} onChange={(value) => setActiveTab(value as DetailRaceTab)} />

        {editRace.saveError ? (
          <div className="rounded-lg border border-[#fdcacb] bg-[#fff5f5] px-4 py-3 text-sm text-[#c82528]">
            {editRace.saveError instanceof Error ? editRace.saveError.message : 'Không thể lưu thay đổi.'}
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto pb-8">
          {activeTab === 'basic' ? (
            <div className="space-y-5">
              <RaceDetailRibbon
                isEditing={isEditing}
                isSaving={editRace.isSaving}
                modifiedAt={editRace.form.modifiedAt}
                onEdit={() => setIsEditing(true)}
                onEnd={handleEnd}
                onPause={handlePause}
                onPublish={handlePublish}
                onResume={handleResume}
                onSave={handleSave}
                onStart={handleStart}
                saveDisabled={!raceId}
                status={editRace.form.status}
              />
              <EditRaceView
                addBooth={editRace.addBooth}
                addOrganizer={editRace.addOrganizer}
                addTeam={editRace.addTeam}
                form={editRace.form}
                handleImageSelected={editRace.handleImageSelected}
                imageInputRef={editRace.imageInputRef}
                isEditing={isEditing}
                openImagePicker={editRace.openImagePicker}
                removeBooth={editRace.removeBooth}
                removeOrganizer={editRace.removeOrganizer}
                removeTeam={editRace.removeTeam}
                updateBasic={editRace.updateBasic}
                updateBooth={editRace.updateBooth}
                updateSetting={editRace.updateSetting}
              />
            </div>
          ) : activeTab === 'live' ? (
            <LiveRaceView raceId={raceId} />
          ) : (
            <PlaceholderTab label={activeTabLabel} />
          )}
        </div>
      </div>
    </main>
  )
}
