import type { PropsWithChildren } from 'react'
import type { EditRaceForm } from '../editRace.form'
import { EditRaceFormContext } from './editRaceForm.context'
import { useEditRaceFormState } from './useEditRaceFormState'

type EditRaceFormProviderProps = PropsWithChildren<{
  initialForm: EditRaceForm
}>

/**
 * Provides isolated frontend editor state to the edit-race UI subtree.
 */
export const EditRaceFormProvider = ({
  children,
  initialForm,
}: EditRaceFormProviderProps) => {
  const editor = useEditRaceFormState(initialForm)

  return (
    <EditRaceFormContext.Provider value={editor}>
      {children}
    </EditRaceFormContext.Provider>
  )
}
