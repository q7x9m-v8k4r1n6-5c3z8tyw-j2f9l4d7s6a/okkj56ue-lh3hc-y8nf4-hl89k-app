import { describe, expect, it } from 'vitest'
import { useSaveBoothCoordinatesMutation } from './useSaveBoothCoordinatesMutation'

describe('useSaveBoothCoordinatesMutation hook contract', () => {
  it('exports useSaveBoothCoordinatesMutation as a callable function', () => {
    expect(typeof useSaveBoothCoordinatesMutation).toBe('function')
  })
})
