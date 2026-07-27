import { useEditRaceForm } from '../../model/frontend/useEditRaceForm'

/**
 * Exposes race settings and named event handlers for the settings UI.
 */
export const useSettingsSection = () => {
  const editor = useEditRaceForm()

  return {
    isEditing: editor.isEditing,
    isHiddenPoint: editor.form.settings.isHiddenPoint,
    isToggledLeaderboard: editor.form.settings.isToggledLeaderboard,
    onHiddenPointChange: (checked: boolean) =>
      editor.updateSetting('isHiddenPoint', checked),
    onLeaderboardChange: (checked: boolean) =>
      editor.updateSetting('isToggledLeaderboard', checked),
  }
}
