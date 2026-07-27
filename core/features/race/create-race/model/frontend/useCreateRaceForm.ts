import { useContext } from 'react'
import { CreateRaceFormContext } from './createRaceForm.context'

/** Returns the create-race frontend state scoped to the nearest provider. */
export const useCreateRaceForm = () => {
  const context = useContext(CreateRaceFormContext)
  if (!context) {
    throw new Error(
      'useCreateRaceForm must be used inside CreateRaceFormProvider.',
    )
  }
  return context
}
