import { useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/core/shared'
import { createRaceActions } from '../../../stores/createRaceSlice'
import { uploadRaceCoverImage } from '../../../api'

export const useBasicInformationStep = () => {
  const dispatch = useAppDispatch()
  const value = useAppSelector((state) => state.createRace.basic)
  const errors = useAppSelector((state) => state.createRace.basicErrors)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const update = (field: keyof typeof value, next: string) => {
    dispatch(createRaceActions.updateBasic({ [field]: next }))
    if (errors[field]) dispatch(createRaceActions.clearBasicError(field))
  }

  const openImagePicker = () => {
    imageInputRef.current?.click()
  }

  const handleImageSelected = async (file: File | undefined) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setUploadError('Vui lòng chọn đúng định dạng file ảnh (jpg, png...)')
      return
    }

    setUploadError('')
    dispatch(createRaceActions.updateBasic({ imageName: file.name }))

    setUploading(true)
    try {
      const url = await uploadRaceCoverImage(file)
      dispatch(createRaceActions.updateBasic({ coverUrl: url }))
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload ảnh thất bại, vui lòng thử lại.')
    } finally {
      setUploading(false)
    }
  }

  return {
    errors,
    imageInputRef,
    openImagePicker,
    update,
    value,
    uploading,
    uploadError,
    handleImageSelected,
  }
}