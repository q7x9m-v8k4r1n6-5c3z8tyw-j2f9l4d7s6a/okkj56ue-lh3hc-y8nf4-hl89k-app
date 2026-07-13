import { useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/core/shared'
import { createRaceActions } from '../../../stores/createRaceSlice'

export const useBasicInformationStep = () => {
  const dispatch = useAppDispatch()
  const value = useAppSelector((state) => state.createRace.basic)
  const errors = useAppSelector((state) => state.createRace.basicErrors)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const update = (field: keyof typeof value, next: string) => {
    dispatch(createRaceActions.updateBasic({ [field]: next }))
    if (errors[field]) dispatch(createRaceActions.clearBasicError(field))
  }

  const openImagePicker = () => {
    imageInputRef.current?.click()
  }

  return {
    errors,
    imageInputRef,
    openImagePicker,
    update,
    value,
  }
}
