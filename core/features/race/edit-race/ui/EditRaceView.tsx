import { useParams } from 'react-router-dom'
import { useEditRaceView } from './useEditRaceView'
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
  const {
    addBooth,
    addOrganizer,
    addTeam,
    detailError,
    endRace,
    form,
    handleImageSelected,
    imageInputRef,
    isEditing,
    isLoadingDetail,
    isSaving,
    openImagePicker,
    pauseRace,
    publishRace,
    removeBooth,
    removeOrganizer,
    removeTeam,
    resumeRace,
    saveChanges,
    saveDisabled,
    saveError,
    startEditing,
    startRace,
    updateBasic,
    updateBooth,
    updateSetting,
  } = useEditRaceView(raceId)

  return (
    <div className="space-y-5">
      {saveError ? (
        <div className="rounded-lg border border-[#fdcacb] bg-[#fff5f5] px-4 py-3 text-sm text-[#c82528]">
          {saveError instanceof Error ? saveError.message : 'Không thể lưu thay đổi.'}
        </div>
      ) : null}

      {detailError ? (
        <div className="rounded-lg border border-[#fdcacb] bg-[#fff5f5] px-4 py-3 text-sm text-[#c82528]">
          {detailError instanceof Error ? detailError.message : 'Không thể tải thông tin trận đấu.'}
        </div>
      ) : null}

      <RaceDetailRibbon
        isEditing={isEditing}
        isSaving={isSaving}
        modifiedAt={form.modifiedAt}
        onEdit={startEditing}
        onEnd={endRace}
        onPause={pauseRace}
        onPublish={publishRace}
        onResume={resumeRace}
        onSave={saveChanges}
        onStart={startRace}
        saveDisabled={saveDisabled}
        status={form.status}
      />

      {isLoadingDetail ? (
        <div className="rounded-lg border border-[#e5e5e5] px-4 py-8 text-center text-sm text-[#667085]">
          Đang tải thông tin trận đấu...
        </div>
      ) : null}

      {!isLoadingDetail && !detailError ? (
        <>
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
        </>
      ) : null}
    </div>
  )
}
