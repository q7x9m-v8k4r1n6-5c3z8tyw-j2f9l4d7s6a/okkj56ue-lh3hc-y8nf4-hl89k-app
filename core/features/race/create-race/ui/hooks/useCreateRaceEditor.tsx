import { BasicInformationStep } from '../steps/BasicInformationStep/BasicInformationStep'
import { BoothInformationStep } from '../steps/BoothInformationStep/BoothInformationStep'
import { OrganizerInformationStep } from '../steps/OrganizerInformationStep/OrganizerInformationStep'
import { SettingsStep } from '../steps/SettingsStep/SettingsStep'
import { TeamInformationStep } from '../steps/TeamInformationStep/TeamInformationStep'
import { useCreateRaceForm } from '../../model/frontend/useCreateRaceForm'

const steps = [
  <BasicInformationStep key="basic" />,
  <BoothInformationStep key="booths" />,
  <TeamInformationStep key="teams" />,
  <OrganizerInformationStep key="organizers" />,
  <SettingsStep key="settings" />,
]

/** Selects the current step view from feature-scoped frontend state. */
export const useCreateRaceEditor = () => {
  const { form } = useCreateRaceForm()
  return { currentStep: steps[form.step - 1] }
}
