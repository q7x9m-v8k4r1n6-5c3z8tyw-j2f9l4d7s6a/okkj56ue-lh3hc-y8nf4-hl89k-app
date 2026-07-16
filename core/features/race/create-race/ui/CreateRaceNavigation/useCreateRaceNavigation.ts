import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector, useToast } from '@/core/shared'
import { validateBasicStep, validateStationStep, buildCreateRaceRequest } from '../../helpers'; // 🔌 Đấu nối hàm build chuẩn từ helpers chung
import { createRaceActions } from '../../stores/createRaceSlice';
import { useCreateRaceMutation } from '../../hooks/useCreateRaceMutation';

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
      // 📊 QUE ĐO 1: Kiểm tra xem dữ liệu người dùng gõ từ UI đã vào đến Redux Store chưa
      console.log("=== 🔌 KIỂM TRA REDUX STORE (Bước 1: basic) ===");
      console.log("Dữ liệu hiện tại trong store:", state.basic);

      // Thực hiện đóng gói dữ liệu dựa trên state hiện tại
      const backendPayload = buildCreateRaceRequest(state);

      // 📊 QUE ĐO 2: Kiểm tra cấu trúc gói tin sau khi chạy qua hàm dịch (Mapping)
      console.log("=== 📦 KIỂM TRA PAYLOAD SAU MAPPING ===");
      console.log("Gói tin sẽ gửi lên Backend:", backendPayload);

      // Kích hoạt truyền tải tín hiệu qua API
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