import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector, useToast } from '@/core/shared'
import { buildCreateRaceRequest, validateBasicStep, validateStationStep } from '../../helpers'
import { createRaceActions } from '../../stores/createRaceSlice'
import { useCreateRaceMutation } from '../../hooks/useCreateRaceMutation'

export const useCreateRaceNavigation = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const state = useAppSelector((store) => store.createRace)
  const createRace = useCreateRaceMutation()

  const requireTeam = () => {
    if (state.teams.length > 0) return false
    dispatch(createRaceActions.setTeamError('Vui lòng chọn ít nhất 1 đội chơi.'))
    dispatch(createRaceActions.setStep(3))
    return true
  }

  const requireOrganizer = () => {
    if (state.organizers.length > 0) return false
    dispatch(createRaceActions.setOrganizerError('Vui lòng chọn ít nhất 1 ban tổ chức.'))
    dispatch(createRaceActions.setStep(4))
    return true
  }

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

    if (state.step === 3 && requireTeam()) return
    if (state.step === 4 && requireOrganizer()) return

    dispatch(createRaceActions.setStep(state.step + 1))
  }

  const submit = async () => {
    try {
      if (requireTeam() || requireOrganizer()) return

      const backendPayload = buildCreateRaceRequest(state)
      const raceId = await createRace.mutateAsync(backendPayload)

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
