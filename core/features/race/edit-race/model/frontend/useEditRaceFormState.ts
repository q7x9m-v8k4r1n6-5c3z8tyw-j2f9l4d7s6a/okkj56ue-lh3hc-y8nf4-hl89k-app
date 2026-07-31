import {
  useCallback,
  useMemo,
  useReducer,
} from 'react'
import type {
  EditRaceBooth,
  EditRaceForm,
  EditRaceFormErrors,
  EditRaceOrganizer,
  EditRaceTeam,
} from '../editRace.form'
import {
  areEditRaceFormsEqual,
  hasEditRaceFormErrors,
  validateEditRaceForm,
} from '../editRace.validation'
import type { EditRaceFormContextValue } from './editRaceForm.context'
import {
  createEditRaceFormState,
  editRaceFormReducer,
  type BasicInformationChanges,
} from './editRaceForm.reducer'
import { useCoverImage } from './useCoverImage'
import { useUnsavedChangesWarning } from './useUnsavedChangesWarning'

const EMPTY_ERRORS: EditRaceFormErrors = { booths: {} }

/**
 * Owns all browser-side state and actions for one editor instance.
 *
 * Server requests are intentionally excluded and live in model/server.
 */
export const useEditRaceFormState = (
  initialForm: EditRaceForm,
): EditRaceFormContextValue => {
  const [state, dispatch] = useReducer(
    editRaceFormReducer,
    initialForm,
    createEditRaceFormState,
  )
  const {
    clear: clearCoverImage,
    file: coverFile,
    previewUrl: coverPreviewUrl,
    select: selectCoverImage,
  } = useCoverImage()

  const validationErrors = useMemo(
    () => validateEditRaceForm(state.form, coverFile),
    [coverFile, state.form],
  )
  const isDirty = useMemo(
    () =>
      !areEditRaceFormsEqual(state.form, state.originalForm) ||
      Boolean(coverFile),
    [coverFile, state.form, state.originalForm],
  )

  useUnsavedChangesWarning(state.isEditing && isDirty)

  /** Starts an edit session without changing the server baseline. */
  const startEditing = useCallback(() => {
    dispatch({ type: 'START_EDITING' })
  }, [])

  /** Discards local changes and restores the last successful server state. */
  const cancelEditing = useCallback(() => {
    clearCoverImage()
    dispatch({ type: 'CANCEL_EDITING' })
  }, [clearCoverImage])

  /** Promotes a successful server response to the new editor baseline. */
  const finishEditing = useCallback((savedForm: EditRaceForm) => {
    clearCoverImage()
    dispatch({ type: 'SAVE_SUCCEEDED', savedForm })
  }, [clearCoverImage])

  /** Selects a cover image and manages the browser object URL lifecycle. */
  const selectCoverFile = useCallback((file: File) => {
    selectCoverImage(file)
    dispatch({ type: 'SET_COVER_FILE_NAME', fileName: file.name })
  }, [selectCoverImage])

  /** Shows validation feedback and reports whether the form can be saved. */
  const validateForSave = useCallback(() => {
    dispatch({ type: 'SHOW_ERRORS' })
    return !hasEditRaceFormErrors(validationErrors)
  }, [validationErrors])

  const updateBasic = useCallback((changes: BasicInformationChanges) => {
    dispatch({ type: 'UPDATE_BASIC', changes })
  }, [])

  const addBooth = useCallback((
    changes: Partial<Omit<EditRaceBooth, 'id'>> = {},
  ) => {
    const id = crypto.randomUUID()
    const booth: EditRaceBooth = {
      id,
      name: '',
      place: '',
      managers: [],
      description: '',
      ...changes,
    }
    dispatch({ type: 'ADD_BOOTH', booth })
    return id
  }, [])

  const updateBooth = useCallback((
    boothId: string,
    changes: Partial<EditRaceBooth>,
  ) => {
    dispatch({ type: 'UPDATE_BOOTH', boothId, changes })
  }, [])

  const removeBooth = useCallback((boothId: string) => {
    dispatch({ type: 'REMOVE_BOOTH', boothId })
  }, [])

  const addTeams = useCallback((teams: EditRaceTeam[]) => {
    dispatch({ type: 'ADD_TEAMS', teams })
  }, [])

  const removeTeam = useCallback((teamId: string) => {
    dispatch({ type: 'REMOVE_TEAM', teamId })
  }, [])

  const addOrganizers = useCallback((organizers: EditRaceOrganizer[]) => {
    dispatch({ type: 'ADD_ORGANIZERS', organizers })
  }, [])

  const removeOrganizer = useCallback((organizerId: string) => {
    dispatch({ type: 'REMOVE_ORGANIZER', organizerId })
  }, [])

  const updateSetting = useCallback((
    key: keyof EditRaceForm['settings'],
    value: boolean,
  ) => {
    dispatch({ type: 'UPDATE_SETTING', key, value })
  }, [])

  return useMemo(() => ({
    addBooth,
    addOrganizers,
    addTeams,
    cancelEditing,
    coverFile,
    coverPreviewUrl,
    errors: state.showErrors ? validationErrors : EMPTY_ERRORS,
    finishEditing,
    form: state.form,
    isDirty,
    isEditing: state.isEditing,
    originalForm: state.originalForm,
    removeBooth,
    removeOrganizer,
    removeTeam,
    selectCoverFile,
    startEditing,
    updateBasic,
    updateBooth,
    updateSetting,
    validateForSave,
  }), [
    addBooth,
    addOrganizers,
    addTeams,
    cancelEditing,
    coverFile,
    coverPreviewUrl,
    finishEditing,
    isDirty,
    removeBooth,
    removeOrganizer,
    removeTeam,
    selectCoverFile,
    startEditing,
    state,
    updateBasic,
    updateBooth,
    updateSetting,
    validateForSave,
    validationErrors,
  ])
}
