import { useEditRaceForm } from '../../model/frontend/useEditRaceForm'

/**
 * Exposes race settings and named event handlers for the settings UI.
 */
export const useSettingsSection = () => {
  const editor = useEditRaceForm()

  return {
    isEditing: editor.isEditing,
    showLeaderboard: editor.form.settings.isToggledLeaderboard,
    showScores: !editor.form.settings.isHiddenPoint,
    onLeaderboardChange: (showLeaderboard: boolean) =>
      editor.updateSetting('isToggledLeaderboard', showLeaderboard),
    onScoresChange: (showScores: boolean) =>
      editor.updateSetting('isHiddenPoint', !showScores),
  }
}
