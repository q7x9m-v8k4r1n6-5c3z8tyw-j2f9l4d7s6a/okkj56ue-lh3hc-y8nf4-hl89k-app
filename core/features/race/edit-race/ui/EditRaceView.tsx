import type { RefObject } from 'react'
import type { EditRaceForm } from '../models'
import {
  BasicInformationSection,
  BoothInformationSection,
  OrganizerInformationSection,
  SettingsSection,
  TeamInformationSection,
} from './components'

type EditRaceViewProps = {
  addBooth: () => void
  addOrganizer: (organizers: Array<{ id: string; displayName?: string; email: string }>) => void
  addTeam: (teams: Array<{ id: string; name: string; leaderEmail: string }>) => void
  form: EditRaceForm
  handleImageSelected: (file?: File) => void
  imageInputRef: RefObject<HTMLInputElement | null>
  isEditing: boolean
  openImagePicker: () => void
  removeBooth: (id: string) => void
  removeOrganizer: (id: string) => void
  removeTeam: (id: string) => void
  updateBasic: (changes: Partial<Pick<EditRaceForm, 'raceName' | 'timeStart' | 'timeEnd' | 'coverUrl' | 'coverFileName' | 'place'>>) => void
  updateBooth: (id: string, changes: Partial<EditRaceForm['booths'][number]>) => void
  updateSetting: (key: keyof EditRaceForm['settings'], value: boolean) => void
}

export const EditRaceView = ({
  addBooth,
  addOrganizer,
  addTeam,
  form,
  handleImageSelected,
  imageInputRef,
  isEditing,
  openImagePicker,
  removeBooth,
  removeOrganizer,
  removeTeam,
  updateBasic,
  updateBooth,
  updateSetting,
}: EditRaceViewProps) => (
  <div className="space-y-5">
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
