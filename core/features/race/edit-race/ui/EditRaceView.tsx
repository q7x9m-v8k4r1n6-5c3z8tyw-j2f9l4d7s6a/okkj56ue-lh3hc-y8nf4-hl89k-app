import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useEditRace } from '../hooks'
import {
  BasicInformationSection,
  BoothInformationSection,
  OrganizerInformationSection,
  RaceDetailRibbon,
  SettingsSection,
  TeamInformationSection,
} from './components'

export const EditRaceView = () => {
  const { raceId } = useParams()
  const [isEditing, setIsEditing] = useState(false)
  const {
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
    <div className="space-y-5">
      {saveError ? (
        <div className="rounded-lg border border-[#fdcacb] bg-[#fff5f5] px-4 py-3 text-sm text-[#c82528]">
          {saveError instanceof Error ? saveError.message : 'Không thể lưu thay đổi.'}
        </div>
      ) : null}

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
  )
}
