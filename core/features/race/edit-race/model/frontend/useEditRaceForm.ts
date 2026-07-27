import { useContext } from 'react'
import { EditRaceFormContext } from './editRaceForm.context'

/**
 * Reads the isolated frontend editor state.
 */
export const useEditRaceForm = () => {
  const context = useContext(EditRaceFormContext)
  if (!context) {
    throw new Error('useEditRaceForm must be used inside EditRaceFormProvider.')
  }
  return context
}
