import { useState } from 'react'
import { Tabs } from '@/core/shared'
import { EDIT_RACE_TABS } from '../constants'
import { useEditRace } from '../hooks'
import {
  BasicInformationSection,
  BoothInformationSection,
  OrganizerInformationSection,
  PlaceholderTab,
  RaceDetailRibbon,
  SettingsSection,
  TeamInformationSection,
} from './components'

type EditRaceViewProps = {
  raceId?: string
}

export const EditRaceView = ({ raceId }: EditRaceViewProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const {
    activeTab,
    addBooth,
    addOrganizer,
    addTeam,
    form,
    handleImageSelected,
    imageInputRef,
    isSaving,
    openImagePicker,
    removeBooth,
    removeOrganizer,
    removeTeam,
    saveError,
    saveRace,
    setActiveTab,
    updateBasic,
    updateBooth,
    updateSetting,
  } = useEditRace(raceId)

  const handleSave = () => {
    saveRace({ onSuccess: () => setIsEditing(false) })
  }

  const handlePublish = () => {
    saveRace({ onSuccess: () => setIsEditing(false), status: 'ready' })
  }

  const handleStart = () => {
    saveRace({ onSuccess: () => setIsEditing(false), status: 'ongoing' })
  }

  const handlePause = () => {
    saveRace({ onSuccess: () => setIsEditing(false), status: 'paused' })
  }

  const handleResume = () => {
    saveRace({ onSuccess: () => setIsEditing(false), status: 'ongoing' })
  }

  const handleEnd = () => {
    saveRace({ onSuccess: () => setIsEditing(false), status: 'completed' })
  }

  return (
    <main className="flex min-h-[calc(100svh-61px)] flex-1 flex-col bg-white px-5 py-4">
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <Tabs items={EDIT_RACE_TABS} value={activeTab} onChange={setActiveTab} />

        {saveError ? (
          <div className="rounded-lg border border-[#fdcacb] bg-[#fff5f5] px-4 py-3 text-sm text-[#c82528]">
            {saveError instanceof Error ? saveError.message : 'Không thể lưu thay đổi.'}
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto pb-8">
          {activeTab === 'basic' ? (
            <div className="space-y-5">
              <RaceDetailRibbon
                isEditing={isEditing}
                isSaving={isSaving}
                modifiedAt={form.modifiedAt}
                onEdit={() => setIsEditing(true)}
                onEnd={handleEnd}
                onPause={handlePause}
                onPublish={handlePublish}
                onResume={handleResume}
                onSave={handleSave}
                onStart={handleStart}
                saveDisabled={!raceId}
                status={form.status}
              />
              <BasicInformationSection
                coverFileName={form.coverFileName}
                coverUrl={form.coverUrl}
                imageInputRef={imageInputRef}
                isEditing={isEditing}
                onImageSelected={handleImageSelected}
                openImagePicker={openImagePicker}
                place={form.place}
                raceName={form.raceName}
                timeEnd={form.timeEnd}
                timeStart={form.timeStart}
                updateBasic={updateBasic}
              />
              <BoothInformationSection addBooth={addBooth} booths={form.booths} isEditing={isEditing} removeBooth={removeBooth} updateBooth={updateBooth} />
              <TeamInformationSection addTeam={addTeam} isEditing={isEditing} removeTeam={removeTeam} teams={form.teams} />
              <OrganizerInformationSection addOrganizer={addOrganizer} isEditing={isEditing} organizers={form.organizers} removeOrganizer={removeOrganizer} />
              <SettingsSection
                isEditing={isEditing}
                isHiddenPoint={form.settings.isHiddenPoint}
                isToggledLeaderboard={form.settings.isToggledLeaderboard}
                updateSetting={updateSetting}
              />
            </div>
          ) : (
            <PlaceholderTab label={EDIT_RACE_TABS.find((tab) => tab.value === activeTab)?.label ?? 'Nội dung'} />
          )}
        </div>
      </div>
    </main>
  )
}
