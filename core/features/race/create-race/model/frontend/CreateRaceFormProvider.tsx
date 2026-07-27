import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react'
import { createInitialRaceForm } from '../createRace.form'
import { CreateRaceFormContext } from './createRaceForm.context'
import { createRaceFormReducer } from './createRaceForm.reducer'

/** Owns all browser-only state for one create-race flow instance. */
export const CreateRaceFormProvider = ({ children }: { children: ReactNode }) => {
  const [form, dispatch] = useReducer(
    createRaceFormReducer,
    undefined,
    createInitialRaceForm,
  )
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  const selectCoverFile = useCallback((file: File) => {
    setCoverFile(file)
    setPreviewUrl((currentUrl) => {
      if (currentUrl) URL.revokeObjectURL(currentUrl)
      return URL.createObjectURL(file)
    })
  }, [])

  const clearCoverFile = useCallback(() => {
    setCoverFile(null)
    setPreviewUrl((currentUrl) => {
      if (currentUrl) URL.revokeObjectURL(currentUrl)
      return ''
    })
  }, [])

  const value = useMemo(() => ({
    form,
    dispatch,
    coverFile,
    previewUrl,
    selectCoverFile,
    clearCoverFile,
  }), [
    clearCoverFile,
    coverFile,
    form,
    previewUrl,
    selectCoverFile,
  ])

  return (
    <CreateRaceFormContext.Provider value={value}>
      {children}
    </CreateRaceFormContext.Provider>
  )
}
