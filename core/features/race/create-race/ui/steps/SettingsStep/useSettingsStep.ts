import { useCreateRaceForm } from '../../../model/frontend/useCreateRaceForm'

/** Adapts create-race settings state for the settings component. */
export const useSettingsStep = () => {
  const { dispatch, form } = useCreateRaceForm()

  return {
    settings: form.settings,
    setShowLeaderboard: (showLeaderboard: boolean) => {
      dispatch({ type: 'settings/update', changes: { showLeaderboard } })
    },
    setShowScores: (showScores: boolean) => {
      dispatch({ type: 'settings/update', changes: { showScores } })
    },
  }
}
