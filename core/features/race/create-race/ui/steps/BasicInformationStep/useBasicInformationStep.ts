import { useRef, useState } from 'react'
import { useCreateRaceForm } from '../../../model/frontend/useCreateRaceForm'

const MAX_COVER_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_COVER_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

/** Adapts the basic-information form state for its rendering component. */
export const useBasicInformationStep = () => {
  const { dispatch, form, previewUrl, selectCoverFile } = useCreateRaceForm()
  const value = form.basic
  const errors = form.errors.basic
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [uploadError, setUploadError] = useState('')

  const update = (field: keyof typeof value, next: string) => {
    dispatch({ type: 'basic/update', changes: { [field]: next } })
    if (errors[field]) dispatch({ type: 'basic/error/clear', field })
  }

  const openImagePicker = () => {
    imageInputRef.current?.click()
  }

  const handleImageSelected = (file: File | undefined) => {
    if (!file) return

    if (!ALLOWED_COVER_TYPES.has(file.type)) {
      setUploadError('Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP.')
      return
    }

    if (file.size > MAX_COVER_SIZE_BYTES) {
      setUploadError('Ảnh bìa không được vượt quá 5MB.')
      return
    }

    setUploadError('')
    dispatch({ type: 'basic/update', changes: { imageName: file.name } })
    selectCoverFile(file)
  }

  return {
    errors,
    imageInputRef,
    openImagePicker,
    update,
    value,
    previewUrl,
    uploadError,
    handleImageSelected,
  }
}
