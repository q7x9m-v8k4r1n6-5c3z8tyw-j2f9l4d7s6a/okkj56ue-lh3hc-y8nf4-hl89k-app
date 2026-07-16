import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector, useToast } from '@/core/shared'
import { useEditRaceMutation } from '@/core/features/race/edit-race'
import { validateBasicStep, validateStationStep, buildCreateRaceRequest } from '../../helpers'
import { createRaceActions } from '../../stores/createRaceSlice'
import { useCreateRaceMutation } from '../../hooks/useCreateRaceMutation'

export type RaceFormMode = 'create' | 'edit'

type UseCreateRaceNavigationOptions = {
  mode?: RaceFormMode
  raceId?: string
}

export const useCreateRaceNavigation = ({ mode = 'create', raceId = '' }: UseCreateRaceNavigationOptions = {}) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const state = useAppSelector((store) => store.createRace)
  const createRace = useCreateRaceMutation()
  const editRace = useEditRaceMutation(raceId)
  const isEditMode = mode === 'edit'
  const isSubmitting = createRace.isPending || editRace.isPending

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
      const backendPayload = buildCreateRaceRequest(state)

      if (isEditMode) {
        const savedRace = await editRace.mutateAsync(backendPayload)
        toast({ title: 'Cập nhật thông tin giải đấu thành công!', variant: 'success' })
        dispatch(createRaceActions.resetCreateRace())

        navigate(`/races/${savedRace.id ?? raceId}`, {
          state: {
            toastMessage: 'Cập nhật thông tin giải đấu thành công!',
          },
        })
        return
      }

      const newRaceId = await createRace.mutateAsync(backendPayload)
      toast({ title: 'Đã tạo trận đấu thành công.', variant: 'success' })
      dispatch(createRaceActions.resetCreateRace())

      navigate('/', {
        state: {
          toastMessage: `Đã tạo trận đấu "${state.basic.name}" thành công!`,
          newRaceId,
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
    isSubmitting,
    mode,
    step: state.step,
    goBack: () => dispatch(createRaceActions.setStep(state.step - 1)),
    cancel: () => isEditMode ? navigate(-1) : navigate('/'),
    continueToNextStep,
    submit,
  }
}
