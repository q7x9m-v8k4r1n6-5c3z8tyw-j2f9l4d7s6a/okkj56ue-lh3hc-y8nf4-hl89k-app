import { useCallback, useEffect, useReducer, useRef } from 'react'
import {
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  type MapFileState,
} from '../buildMap.types'

export interface ImageValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Validates file format, non-empty content, and max size constraint (<= 20MB).
 */
export const validateImageFile = (file: File): ImageValidationResult => {
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File ảnh không hợp lệ hoặc bị rỗng (0 bytes).',
    }
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      isValid: false,
      error: 'Dung lượng ảnh vượt quá giới hạn cho phép (tối đa 20MB).',
    }
  }

  const mimeType = (file.type || '').toLowerCase()
  if (ALLOWED_IMAGE_TYPES.includes(mimeType as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return { isValid: true }
  }

  const dotIndex = file.name.lastIndexOf('.')
  if (dotIndex !== -1) {
    const extension = file.name.slice(dotIndex).toLowerCase()
    if ((ALLOWED_IMAGE_EXTENSIONS as readonly string[]).includes(extension)) {
      return { isValid: true }
    }
  }

  return {
    isValid: false,
    error: 'Định dạng file không được hỗ trợ. Vui lòng chọn file ảnh JPG, PNG hoặc WebP.',
  }
}

/**
 * Validates if the selected file is a supported image (JPG, PNG, WebP).
 */
export const isValidImageFile = (file: File): boolean => {
  return validateImageFile(file).isValid
}

export type BuildMapAction =
  | { type: 'SELECT_FILE_SUCCESS'; file: File; previewUrl: string }
  | { type: 'SELECT_FILE_ERROR'; error: string }
  | { type: 'SYNC_PERSISTED_URL'; url: string | null }
  | { type: 'CANCEL_CHANGES' }
  | { type: 'SAVE_SUCCESS'; url: string }
  | { type: 'REMOVE_FILE' }
  | { type: 'CLEAR_ERROR' }

export const initialBuildMapState: MapFileState = {
  file: null,
  previewUrl: null,
  persistedUrl: null,
  isDirty: false,
  error: null,
}

/**
 * Pure reducer function governing state transitions for map upload, preview, and save status.
 */
export const buildMapReducer = (
  state: MapFileState,
  action: BuildMapAction,
): MapFileState => {
  switch (action.type) {
    case 'SELECT_FILE_SUCCESS':
      return {
        ...state,
        file: action.file,
        previewUrl: action.previewUrl,
        isDirty: true,
        error: null,
      }
    case 'SELECT_FILE_ERROR':
      return {
        ...state,
        error: action.error,
      }
    case 'SYNC_PERSISTED_URL': {
      // If user has local unsaved edits, retain previewUrl/file while keeping persistedUrl synchronized
      if (state.isDirty) {
        return {
          ...state,
          persistedUrl: action.url,
        }
      }
      return {
        ...state,
        persistedUrl: action.url,
        previewUrl: action.url,
        file: null,
        isDirty: false,
        error: null,
      }
    }
    case 'CANCEL_CHANGES':
      return {
        ...state,
        file: null,
        previewUrl: state.persistedUrl,
        isDirty: false,
        error: null,
      }
    case 'SAVE_SUCCESS':
      return {
        ...state,
        file: null,
        persistedUrl: action.url,
        previewUrl: action.url,
        isDirty: false,
        error: null,
      }
    case 'REMOVE_FILE':
      return {
        ...state,
        file: null,
        previewUrl: null,
        persistedUrl: state.persistedUrl,
        isDirty: true,
        error: null,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

/**
 * Custom hook to manage local map upload state, Object URL lifecycle, and dirty state.
 * Ensures Object URLs are revoked when files change or on unmount.
 */
export const useBuildMapState = (initialPersistedUrl: string | null = null) => {
  const [state, dispatch] = useReducer(buildMapReducer, {
    ...initialBuildMapState,
    persistedUrl: initialPersistedUrl,
    previewUrl: initialPersistedUrl,
  })

  // Keep track of the current blob preview URL for cleanup
  const currentBlobUrlRef = useRef<string | null>(null)

  const cleanupBlobUrl = useCallback(() => {
    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current)
      currentBlobUrlRef.current = null
    }
  }, [])

  // Sync server persisted URL when it changes and state is not dirty
  useEffect(() => {
    if (initialPersistedUrl !== undefined) {
      dispatch({ type: 'SYNC_PERSISTED_URL', url: initialPersistedUrl })
    }
  }, [initialPersistedUrl])

  // Revoke object URL on unmount
  useEffect(() => {
    return () => {
      cleanupBlobUrl()
    }
  }, [cleanupBlobUrl])

  const selectFile = useCallback(
    (file: File) => {
      const validation = validateImageFile(file)
      if (!validation.isValid) {
        dispatch({
          type: 'SELECT_FILE_ERROR',
          error:
            validation.error ||
            'Định dạng file không được hỗ trợ. Vui lòng chọn file ảnh JPG, PNG hoặc WebP.',
        })
        return
      }

      cleanupBlobUrl()

      const previewUrl = URL.createObjectURL(file)
      currentBlobUrlRef.current = previewUrl

      dispatch({
        type: 'SELECT_FILE_SUCCESS',
        file,
        previewUrl,
      })
    },
    [cleanupBlobUrl],
  )

  const cancelChanges = useCallback(() => {
    cleanupBlobUrl()
    dispatch({ type: 'CANCEL_CHANGES' })
  }, [cleanupBlobUrl])

  const saveSuccess = useCallback(
    (savedUrl: string) => {
      cleanupBlobUrl()
      dispatch({ type: 'SAVE_SUCCESS', url: savedUrl })
    },
    [cleanupBlobUrl],
  )

  const removeFile = useCallback(() => {
    cleanupBlobUrl()
    dispatch({ type: 'REMOVE_FILE' })
  }, [cleanupBlobUrl])

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' })
  }, [])

  return {
    file: state.file,
    previewUrl: state.previewUrl,
    persistedUrl: state.persistedUrl,
    isDirty: state.isDirty,
    error: state.error,
    selectFile,
    cancelChanges,
    saveSuccess,
    removeFile,
    clearError,
  }
}

export type UseBuildMapStateReturn = ReturnType<typeof useBuildMapState>
