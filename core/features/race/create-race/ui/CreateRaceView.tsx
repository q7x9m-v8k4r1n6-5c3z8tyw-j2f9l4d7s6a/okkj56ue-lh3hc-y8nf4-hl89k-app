import { CreateRaceFormProvider } from '../model/frontend/CreateRaceFormProvider'
import { CreateRaceEditor } from './CreateRaceEditor'

/** Public feature view that isolates one create-race workflow instance. */
export const CreateRaceView = () => (
  <CreateRaceFormProvider>
    <CreateRaceEditor />
  </CreateRaceFormProvider>
)
