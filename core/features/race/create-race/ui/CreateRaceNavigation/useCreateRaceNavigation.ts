import { useNavigate } from 'react-router-dom'
import { useToast } from '@/core/shared'
import { mapCreateRaceFormToRequest } from '../../model/mapCreateRaceFormToRequest'
import {
  hasValidationErrors,
  validateBasicStep,
  validateStationStep,
} from '../../model/createRace.validation'
import { useCreateRaceForm } from '../../model/frontend/useCreateRaceForm'
import { useCreateRaceMutation } from '../../model/server/useCreateRaceMutation'

/** Coordinates step validation, submission and navigation for create-race. */
export const useCreateRaceNavigation = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { clearCoverFile, coverFile, dispatch, form } = useCreateRaceForm()
  const createRace = useCreateRaceMutation()

  const continueToNextStep = () => {
    if (form.step === 1) {
      const errors = validateBasicStep(form.basic)
      dispatch({ type: 'basic/errors/set', errors })
      if (hasValidationErrors(errors)) {
        dispatch({ type: 'step/set', step: 1 })
        return
      }
    }

    if (form.step === 2) {
      const errors = validateStationStep(form.stations)
      dispatch({ type: 'stations/errors/set', errors })
      if (hasValidationErrors(errors)) {
        dispatch({ type: 'step/set', step: 2 })
        return
      }
    }

    dispatch({ type: 'step/set', step: form.step + 1 })
  }

  const submit = async () => {
    try {
      const request = mapCreateRaceFormToRequest(form)
      const raceId = await createRace.mutateAsync({
        request,
        coverImage: coverFile,
      })

      toast({ title: 'Đã tạo trận đấu thành công.', variant: 'success' })
      clearCoverFile()

      navigate('/', {
        state: {
          toastMessage: `Đã tạo trận đấu "${form.basic.name}" thành công!`,
          newRaceId: raceId,
        },
      })
    } catch (error) {
      toast({
        title: 'Không thể tạo trận đấu',
        description: error instanceof Error ? error.message : undefined,
        variant: 'danger',
      })
    }
  }

  return {
    isSubmitting: createRace.isPending,
    step: form.step,
    goBack: () => dispatch({ type: 'step/set', step: form.step - 1 }),
    cancel: () => navigate('/'),
    continueToNextStep,
    submit,
  }
}
