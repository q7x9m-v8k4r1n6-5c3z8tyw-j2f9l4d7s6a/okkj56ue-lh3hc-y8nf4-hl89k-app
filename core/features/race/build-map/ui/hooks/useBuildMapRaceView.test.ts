import { describe, expect, it } from 'vitest'
import { getBuildMapErrorMessage, useBuildMapRaceView } from './useBuildMapRaceView'

describe('getBuildMapErrorMessage helper', () => {
  it('extracts message from standard Error instances', () => {
    const err = new Error('Network timed out')
    expect(getBuildMapErrorMessage(err)).toBe('Network timed out')
  })

  it('extracts message from API error objects containing message string', () => {
    const apiErr = { message: 'Dung lượng file quá lớn từ server', status: 413 }
    expect(getBuildMapErrorMessage(apiErr)).toBe('Dung lượng file quá lớn từ server')
  })

  it('returns default fallback message for non-error primitives and empty objects', () => {
    expect(getBuildMapErrorMessage(null)).toBe('Không thể lưu bản đồ trận đấu. Vui lòng thử lại.')
    expect(getBuildMapErrorMessage(undefined)).toBe('Không thể lưu bản đồ trận đấu. Vui lòng thử lại.')
    expect(getBuildMapErrorMessage({})).toBe('Không thể lưu bản đồ trận đấu. Vui lòng thử lại.')
    expect(getBuildMapErrorMessage(500)).toBe('Không thể lưu bản đồ trận đấu. Vui lòng thử lại.')
  })

  it('returns custom fallback when specified', () => {
    expect(getBuildMapErrorMessage(null, 'Custom error')).toBe('Custom error')
  })
})

describe('useBuildMapRaceView contract', () => {
  it('exports useBuildMapRaceView view-model hook function', () => {
    expect(typeof useBuildMapRaceView).toBe('function')
  })
})

