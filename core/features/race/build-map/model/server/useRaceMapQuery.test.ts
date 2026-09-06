import { describe, expect, it, vi } from 'vitest'
import * as apiModule from '../../api/buildMap.api'
import { buildMapQueryKeys } from './buildMap.queryKeys'
import {
  getRaceBoothsQueryOptions,
  getRaceMapDetailQueryOptions,
} from './useRaceMapQuery'

describe('useRaceMapQuery options', () => {
  describe('getRaceMapDetailQueryOptions', () => {
    it('constructs correct queryKey and enabled flag when raceId is provided', () => {
      const options = getRaceMapDetailQueryOptions('race-123')
      expect(options.queryKey).toEqual(buildMapQueryKeys.mapDetail('race-123'))
      expect(options.enabled).toBe(true)
    })

    it('sets enabled to false when raceId is undefined or empty string', () => {
      const optionsUndefined = getRaceMapDetailQueryOptions(undefined)
      expect(optionsUndefined.enabled).toBe(false)

      const optionsEmpty = getRaceMapDetailQueryOptions('   ')
      expect(optionsEmpty.enabled).toBe(false)
    })

    it('executes getRaceMapDetail with raceId and AbortSignal', async () => {
      const spy = vi
        .spyOn(apiModule, 'getRaceMapDetail')
        .mockResolvedValueOnce({
          id: 'race-123',
          mapImageUrl: 'https://example.com/map.png',
        })

      const controller = new AbortController()
      const options = getRaceMapDetailQueryOptions('race-123')
      const result = await options.queryFn({ signal: controller.signal })

      expect(spy).toHaveBeenCalledWith('race-123', controller.signal)
      expect(result.mapImageUrl).toBe('https://example.com/map.png')
      spy.mockRestore()
    })
  })

  describe('getRaceBoothsQueryOptions', () => {
    it('constructs correct queryKey and enabled flag when raceId is provided', () => {
      const options = getRaceBoothsQueryOptions('race-456')
      expect(options.queryKey).toEqual(buildMapQueryKeys.booths('race-456'))
      expect(options.enabled).toBe(true)
    })

    it('sets enabled to false when raceId is undefined or empty string', () => {
      const optionsUndefined = getRaceBoothsQueryOptions(undefined)
      expect(optionsUndefined.enabled).toBe(false)

      const optionsEmpty = getRaceBoothsQueryOptions('')
      expect(optionsEmpty.enabled).toBe(false)
    })

    it('executes getRaceBooths with raceId and AbortSignal', async () => {
      const spy = vi
        .spyOn(apiModule, 'getRaceBooths')
        .mockResolvedValueOnce([
          {
            boothId: 'b-1',
            boothName: 'Trạm 1',
            boothLocation: '',
            description: '',
            status: '',
            isHidden: false,
            currentTeamName: null,
            currentOrganizerName: null,
          },
        ])

      const controller = new AbortController()
      const options = getRaceBoothsQueryOptions('race-456')
      const result = await options.queryFn({ signal: controller.signal })

      expect(spy).toHaveBeenCalledWith('race-456', controller.signal)
      expect(result).toHaveLength(1)
      expect(result[0].boothName).toBe('Trạm 1')
      spy.mockRestore()
    })
  })
})
