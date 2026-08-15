import { describe, expect, it } from 'vitest'
import {
  buildMapReducer,
  initialBuildMapState,
  isValidImageFile,
  useBuildMapState,
  validateImageFile,
} from './useBuildMapState'

describe('validateImageFile & isValidImageFile', () => {
  it('validates supported image MIME types', () => {
    const jpgFile = new File(['data'], 'map.jpg', { type: 'image/jpeg' })
    const pngFile = new File(['data'], 'map.png', { type: 'image/png' })
    const webpFile = new File(['data'], 'map.webp', { type: 'image/webp' })
    const pdfFile = new File(['data'], 'doc.pdf', { type: 'application/pdf' })

    expect(isValidImageFile(jpgFile)).toBe(true)
    expect(isValidImageFile(pngFile)).toBe(true)
    expect(isValidImageFile(webpFile)).toBe(true)
    expect(isValidImageFile(pdfFile)).toBe(false)
  })

  it('rejects empty 0-byte files with descriptive error', () => {
    const emptyFile = new File([], 'empty.png', { type: 'image/png' })
    const res = validateImageFile(emptyFile)
    expect(res.isValid).toBe(false)
    expect(res.error).toContain('rỗng')
  })

  it('rejects files larger than 20MB', () => {
    const bigFile = new File([new Uint8Array(21 * 1024 * 1024)], 'huge.jpg', {
      type: 'image/jpeg',
    })
    const res = validateImageFile(bigFile)
    expect(res.isValid).toBe(false)
    expect(res.error).toContain('20MB')
  })

  it('validates case-insensitive MIME types and extension fallbacks', () => {
    const upperMimeFile = new File(['data'], 'map.unknown', { type: 'IMAGE/JPEG' })
    const jpgFile = new File(['data'], 'map.JPG', { type: '' })
    const pngFile = new File(['data'], 'map.PNG', { type: '' })
    const webpFile = new File(['data'], 'map.WEBP', { type: '' })
    const txtFile = new File(['data'], 'notes.txt', { type: '' })
    const noExtFile = new File(['data'], 'noext', { type: '' })

    expect(isValidImageFile(upperMimeFile)).toBe(true)
    expect(isValidImageFile(jpgFile)).toBe(true)
    expect(isValidImageFile(pngFile)).toBe(true)
    expect(isValidImageFile(webpFile)).toBe(true)
    expect(isValidImageFile(txtFile)).toBe(false)
    expect(isValidImageFile(noExtFile)).toBe(false)
  })

  it('supports pjpeg and x-png legacy mime types', () => {
    const pjpegFile = new File(['data'], 'map.pjpeg', { type: 'image/pjpeg' })
    const xpngFile = new File(['data'], 'map.xpng', { type: 'image/x-png' })

    expect(isValidImageFile(pjpegFile)).toBe(true)
    expect(isValidImageFile(xpngFile)).toBe(true)
  })

  it('validates exact 20MB boundary condition', () => {
    const exactMaxFile = new File([new Uint8Array(20 * 1024 * 1024)], 'exact.png', {
      type: 'image/png',
    })
    const overMaxFile = new File([new Uint8Array(20 * 1024 * 1024 + 1)], 'over.png', {
      type: 'image/png',
    })

    expect(validateImageFile(exactMaxFile).isValid).toBe(true)
    expect(validateImageFile(overMaxFile).isValid).toBe(false)
  })

  it('handles multi-dot filenames correctly', () => {
    const multiDotValid = new File(['data'], 'vietnam.map.final.v2.webp', { type: '' })
    const multiDotInvalid = new File(['data'], 'vietnam.map.final.v2.pdf', { type: '' })

    expect(isValidImageFile(multiDotValid)).toBe(true)
    expect(isValidImageFile(multiDotInvalid)).toBe(false)
  })
})

describe('buildMapReducer pure reducer logic', () => {
  const sampleFile = new File(['test'], 'map.png', { type: 'image/png' })
  const samplePreviewUrl = 'blob:http://localhost/map.png'
  const persistedUrl = 'https://blob.storage.azure.com/race-map/map-123.png'

  it('handles SELECT_FILE_SUCCESS and sets isDirty to true', () => {
    const nextState = buildMapReducer(initialBuildMapState, {
      type: 'SELECT_FILE_SUCCESS',
      file: sampleFile,
      previewUrl: samplePreviewUrl,
    })

    expect(nextState).toEqual({
      file: sampleFile,
      previewUrl: samplePreviewUrl,
      persistedUrl: null,
      isDirty: true,
      error: null,
    })
  })

  it('handles SELECT_FILE_ERROR while preserving current file preview', () => {
    const currentState = {
      file: sampleFile,
      previewUrl: samplePreviewUrl,
      persistedUrl: null,
      isDirty: true,
      error: null,
    }

    const nextState = buildMapReducer(currentState, {
      type: 'SELECT_FILE_ERROR',
      error: 'File format not supported',
    })

    expect(nextState).toEqual({
      file: sampleFile,
      previewUrl: samplePreviewUrl,
      persistedUrl: null,
      isDirty: true,
      error: 'File format not supported',
    })
  })

  it('handles SYNC_PERSISTED_URL when not dirty', () => {
    const nextState = buildMapReducer(initialBuildMapState, {
      type: 'SYNC_PERSISTED_URL',
      url: persistedUrl,
    })

    expect(nextState).toEqual({
      file: null,
      previewUrl: persistedUrl,
      persistedUrl: persistedUrl,
      isDirty: false,
      error: null,
    })
  })

  it('updates persistedUrl during SYNC_PERSISTED_URL while preserving local preview and dirty state', () => {
    const dirtyState = {
      file: sampleFile,
      previewUrl: samplePreviewUrl,
      persistedUrl: 'https://old-url.png',
      isDirty: true,
      error: null,
    }

    const nextState = buildMapReducer(dirtyState, {
      type: 'SYNC_PERSISTED_URL',
      url: 'https://new-url.png',
    })

    expect(nextState).toEqual({
      file: sampleFile,
      previewUrl: samplePreviewUrl,
      persistedUrl: 'https://new-url.png',
      isDirty: true,
      error: null,
    })
  })

  it('handles CANCEL_CHANGES by reverting to persistedUrl', () => {
    const dirtyState = {
      file: sampleFile,
      previewUrl: samplePreviewUrl,
      persistedUrl: persistedUrl,
      isDirty: true,
      error: 'Some error',
    }

    const nextState = buildMapReducer(dirtyState, { type: 'CANCEL_CHANGES' })

    expect(nextState).toEqual({
      file: null,
      previewUrl: persistedUrl,
      persistedUrl: persistedUrl,
      isDirty: false,
      error: null,
    })
  })

  it('handles SAVE_SUCCESS by setting new persistedUrl and clearing isDirty', () => {
    const savedUrl = 'https://blob.storage.azure.com/race-map/new-map.png'
    const dirtyState = {
      file: sampleFile,
      previewUrl: samplePreviewUrl,
      persistedUrl: persistedUrl,
      isDirty: true,
      error: null,
    }

    const nextState = buildMapReducer(dirtyState, {
      type: 'SAVE_SUCCESS',
      url: savedUrl,
    })

    expect(nextState).toEqual({
      file: null,
      previewUrl: savedUrl,
      persistedUrl: savedUrl,
      isDirty: false,
      error: null,
    })
  })

  it('handles REMOVE_FILE by clearing preview and retaining persistedUrl for possible rollback', () => {
    const currentState = {
      file: sampleFile,
      previewUrl: samplePreviewUrl,
      persistedUrl: persistedUrl,
      isDirty: false,
      error: 'Some error',
    }

    const nextState = buildMapReducer(currentState, { type: 'REMOVE_FILE' })

    expect(nextState).toEqual({
      file: null,
      previewUrl: null,
      persistedUrl: persistedUrl,
      isDirty: true,
      error: null,
    })

    // Rollback test
    const rolledBackState = buildMapReducer(nextState, { type: 'CANCEL_CHANGES' })
    expect(rolledBackState.previewUrl).toBe(persistedUrl)
    expect(rolledBackState.isDirty).toBe(false)
  })

  it('handles CLEAR_ERROR', () => {
    const currentState = {
      file: sampleFile,
      previewUrl: samplePreviewUrl,
      persistedUrl: null,
      isDirty: true,
      error: 'Some error',
    }

    const nextState = buildMapReducer(currentState, { type: 'CLEAR_ERROR' })

    expect(nextState).toEqual({
      file: sampleFile,
      previewUrl: samplePreviewUrl,
      persistedUrl: null,
      isDirty: true,
      error: null,
    })
  })

  it('returns previous state for unknown action types', () => {
    const currentState = {
      file: sampleFile,
      previewUrl: samplePreviewUrl,
      persistedUrl: persistedUrl,
      isDirty: false,
      error: null,
    }

    // @ts-expect-error test unknown action fallback
    const nextState = buildMapReducer(currentState, { type: 'UNKNOWN_ACTION' })
    expect(nextState).toBe(currentState)
  })

  it('executes a full multi-step workflow cleanly', () => {
    // 1. Initial empty state with server url
    let state = buildMapReducer(initialBuildMapState, {
      type: 'SYNC_PERSISTED_URL',
      url: persistedUrl,
    })
    expect(state.previewUrl).toBe(persistedUrl)
    expect(state.isDirty).toBe(false)

    // 2. Select a replacement file
    const newFile = new File(['new'], 'new.png', { type: 'image/png' })
    state = buildMapReducer(state, {
      type: 'SELECT_FILE_SUCCESS',
      file: newFile,
      previewUrl: 'blob:new.png',
    })
    expect(state.isDirty).toBe(true)
    expect(state.file).toBe(newFile)

    // 3. User cancels
    state = buildMapReducer(state, { type: 'CANCEL_CHANGES' })
    expect(state.isDirty).toBe(false)
    expect(state.previewUrl).toBe(persistedUrl)
    expect(state.file).toBeNull()

    // 4. User selects again and saves successfully
    state = buildMapReducer(state, {
      type: 'SELECT_FILE_SUCCESS',
      file: newFile,
      previewUrl: 'blob:new.png',
    })
    const finalServerUrl = 'https://blob.storage.azure.com/race-map/saved.png'
    state = buildMapReducer(state, {
      type: 'SAVE_SUCCESS',
      url: finalServerUrl,
    })
    expect(state.isDirty).toBe(false)
    expect(state.previewUrl).toBe(finalServerUrl)
    expect(state.persistedUrl).toBe(finalServerUrl)
    expect(state.file).toBeNull()
  })
})

describe('useBuildMapState contract', () => {
  it('exports useBuildMapState hook function', () => {
    expect(typeof useBuildMapState).toBe('function')
  })
})

