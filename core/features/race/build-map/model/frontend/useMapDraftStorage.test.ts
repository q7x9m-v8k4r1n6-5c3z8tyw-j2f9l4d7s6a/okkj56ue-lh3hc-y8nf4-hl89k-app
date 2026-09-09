import { describe, expect, it, beforeEach, vi } from 'vitest'
import {
  clearMapDraft,
  getDraftStorageKey,
  loadMapDraft,
  saveMapDraft,
} from './useMapDraftStorage'

describe('useMapDraftStorage', () => {
  const raceId = 'race-abc-123'
  const mockCoords = {
    'booth-1': { mapX: 25.5, mapY: 50 },
    'booth-2': { mapX: 75.25, mapY: 80.1 },
  }

  let store: Record<string, string> = {}

  const mockStorage: Storage = {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    key: vi.fn(() => null),
    length: 0,
  }

  beforeEach(() => {
    store = {}
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true,
    })
    vi.clearAllMocks()
  })

  it('generates the correct storage key', () => {
    expect(getDraftStorageKey(raceId)).toBe('race_map_draft_race-abc-123')
  })

  it('saves and loads coordinates correctly', () => {
    const success = saveMapDraft(raceId, mockCoords)
    expect(success).toBe(true)

    const raw = localStorage.getItem('race_map_draft_race-abc-123')
    expect(raw).not.toBeNull()

    const loaded = loadMapDraft(raceId)
    expect(loaded).toEqual(mockCoords)
  })

  it('clears draft from localStorage', () => {
    saveMapDraft(raceId, mockCoords)
    expect(loadMapDraft(raceId)).not.toBeNull()

    clearMapDraft(raceId)
    expect(loadMapDraft(raceId)).toBeNull()
    expect(localStorage.getItem('race_map_draft_race-abc-123')).toBeNull()
  })

  it('returns null when loading non-existent draft', () => {
    expect(loadMapDraft('non-existent')).toBeNull()
  })

  it('distinguishes empty draft {} from non-existent draft null', () => {
    // Non-existent returns null
    expect(loadMapDraft(raceId)).toBeNull()

    // Explicit empty draft {} returns {}
    saveMapDraft(raceId, {})
    expect(loadMapDraft(raceId)).toEqual({})
  })

  it('handles empty or whitespace raceId safely', () => {
    expect(saveMapDraft('', mockCoords)).toBe(false)
    expect(saveMapDraft('   ', mockCoords)).toBe(false)
    expect(loadMapDraft('')).toBeNull()
    expect(loadMapDraft('   ')).toBeNull()
    clearMapDraft('')
  })

  it('filters out corrupted entries from draft', () => {
    const corrupted = {
      'booth-valid': { mapX: 10, mapY: 20 },
      'booth-invalid-1': { mapX: 'not a number', mapY: 20 },
      'booth-invalid-2': null,
    }
    localStorage.setItem(getDraftStorageKey(raceId), JSON.stringify(corrupted))

    const loaded = loadMapDraft(raceId)
    expect(loaded).toEqual({
      'booth-valid': { mapX: 10, mapY: 20 },
    })
  })

  it('catches and handles localStorage exceptions defensively', () => {
    vi.mocked(mockStorage.setItem).mockImplementationOnce(() => {
      throw new Error('QuotaExceeded')
    })

    const success = saveMapDraft(raceId, mockCoords)
    expect(success).toBe(false)
  })
})
