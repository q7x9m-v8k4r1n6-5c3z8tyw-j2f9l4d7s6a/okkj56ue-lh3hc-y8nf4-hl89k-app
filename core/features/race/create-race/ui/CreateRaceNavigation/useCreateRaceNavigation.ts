import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector, useToast } from '@/core/shared'
import { validateBasicStep, validateStationStep } from '../../helpers';
import { createRaceActions } from '../../stores/createRaceSlice';
import { useCreateRaceMutation } from '../../hooks/useCreateRaceMutation';
import { mapToBackendRequest } from '../../helpers/mapToBackendRequest';

export const useCreateRaceNavigation = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
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
      // Gửi toàn bộ state (không chỉ CreateRaceRequest thu gọn), để
      // mapToBackendRequest tự đóng gói đúng field và gửi đủ danh sách
      // organizer 
      const backendPayload = mapToBackendRequest(state);
      const raceId = await createRace.mutateAsync(backendPayload);

      toast({ title: 'Đã tạo trận đấu thành công.', variant: 'success' })
      dispatch(createRaceActions.resetCreateRace())

      navigate('/', {
        state: {
          toastMessage: `Đã tạo trận đấu "${state.basic.name}" thành công!`,
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
    step: state.step,
    goBack: () => dispatch(createRaceActions.setStep(state.step - 1)),
    cancel: () => navigate('/'),
    continueToNextStep,
    submit,
  }
}