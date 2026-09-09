import { describe, expect, it, vi } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import * as apiModule from '../../api/buildMap.api'
import { buildMapQueryKeys } from './buildMap.queryKeys'
import { getUpdateBoothCoordinatesMutationOptions } from './useUpdateBoothCoordinatesMutation'

describe('useUpdateBoothCoordinatesMutation options', () => {
  it('throws error in mutationFn when raceId is missing or empty', async () => {
    const queryClient = new QueryClient()
    const optionsUndefined = getUpdateBoothCoordinatesMutationOptions(queryClient, undefined)
    const payload = { coordinates: [{ boothId: 'b-1', mapX: 10, mapY: 20 }] }

    expect(() => optionsUndefined.mutationFn(payload)).toThrow(
      'Không tìm thấy mã trận đấu.',
    )

    const optionsEmpty = getUpdateBoothCoordinatesMutationOptions(queryClient, '   ')
    expect(() => optionsEmpty.mutationFn(payload)).toThrow(
      'Không tìm thấy mã trận đấu.',
    )
  })

  it('calls updateBoothCoordinates with raceId and payload in mutationFn', async () => {
    const queryClient = new QueryClient()
    const options = getUpdateBoothCoordinatesMutationOptions(queryClient, 'race-789')
    const payload = {
      coordinates: [
        { boothId: 'b-1', mapX: 10, mapY: 20 },
        { boothId: 'b-2', mapX: 30, mapY: 40 },
      ],
    }

    const spy = vi.spyOn(apiModule, 'updateBoothCoordinates').mockResolvedValueOnce(true)

    const result = await options.mutationFn(payload)

    expect(spy).toHaveBeenCalledWith('race-789', payload)
    expect(result).toBe(true)
    spy.mockRestore()
  })

  it('invalidates booths, mapDetail, and buildMapQueryKeys.all on success', () => {
    const queryClient = new QueryClient()
    const invalidateSpy = vi
      .spyOn(queryClient, 'invalidateQueries')
      .mockResolvedValue(undefined)

    const options = getUpdateBoothCoordinatesMutationOptions(queryClient, 'race-789')
    options.onSuccess()

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: buildMapQueryKeys.booths('race-789'),
    })
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: buildMapQueryKeys.mapDetail('race-789'),
    })
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: buildMapQueryKeys.all,
    })
  })

  it('invalidates only buildMapQueryKeys.all when raceId is missing on success', () => {
    const queryClient = new QueryClient()
    const invalidateSpy = vi
      .spyOn(queryClient, 'invalidateQueries')
      .mockResolvedValue(undefined)

    const options = getUpdateBoothCoordinatesMutationOptions(queryClient, undefined)
    options.onSuccess()

    expect(invalidateSpy).toHaveBeenCalledTimes(1)
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: buildMapQueryKeys.all,
    })
  })
})
