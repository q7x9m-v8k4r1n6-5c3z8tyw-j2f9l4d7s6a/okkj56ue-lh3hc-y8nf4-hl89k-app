import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector, useToast } from '@/core/shared'
import {
  buildCreateRaceRequest,
  validateBasicStep,
  validateStationStep,
} from '../../helpers'
import { createRaceActions } from '../../stores/createRaceSlice'
import { useCreateRaceMutation } from '../../hooks/useCreateRaceMutation'

export const useCreateRaceNavigation = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const toast = useToast()
  const state = useAppSelector((store) => store.createRace)
  const createRace = useCreateRaceMutation()

  const continueToNextStep = () => {
    const hasValidationErrors = (errors: object) => Object.keys(errors).length > 0

    if (state.step === 1) {
      const errors = validateBasicStep(state.basic)
      dispatch(createRaceActions.setBasicErrors(errors))
      if (hasValidationErrors(errors)) {
        dispatch(createRaceActions.setStep(1))
        return
      }
    }
    if (state.step === 2) {
      const errors = validateStationStep(state.stations)
      dispatch(createRaceActions.setStationErrors(errors))
      if (hasValidationErrors(errors)) {
        dispatch(createRaceActions.setStep(2))
        return
      }
    }
    dispatch(createRaceActions.setStep(state.step + 1))
  }

  const submit = async () => {
    try {
      await createRace.mutateAsync(buildCreateRaceRequest(state))
      toast.toast({ title: 'Đã tạo trận đấu thành công.', variant: 'success' })
      dispatch(createRaceActions.resetCreateRace())
      navigate('/')
    } catch (error) {
      toast.toast({
        title: 'Không thể tạo trận đấu',
        description: error instanceof Error ? error.message : undefined,
        variant: 'danger',
      })
    }
  }

  return {
    isSubmitting: createRace.isPending,
    step: state.step,
    goBack: () => dispatch(createRaceActions.setStep(state.step - 1)),
    cancel: () => navigate('/'),
    continueToNextStep,
    submit,
  }
}
