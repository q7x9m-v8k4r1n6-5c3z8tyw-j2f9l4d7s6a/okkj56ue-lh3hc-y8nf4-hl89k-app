import { describe, expect, it, vi } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import * as apiModule from '../../api/buildMap.api'
import { buildMapQueryKeys } from './buildMap.queryKeys'
import { getUploadRaceMapMutationOptions } from './useUploadRaceMapMutation'

describe('useUploadRaceMapMutation options', () => {
  it('throws error in mutationFn when raceId is missing or empty', async () => {
    const queryClient = new QueryClient()
    const optionsUndefined = getUploadRaceMapMutationOptions(queryClient, undefined)
    const file = new File(['content'], 'map.png', { type: 'image/png' })

    expect(() => optionsUndefined.mutationFn(file)).toThrow(
      'Không tìm thấy mã trận đấu.',
    )

    const optionsEmpty = getUploadRaceMapMutationOptions(queryClient, '   ')
    expect(() => optionsEmpty.mutationFn(file)).toThrow(
      'Không tìm thấy mã trận đấu.',
    )
  })

  it('calls uploadRaceMap with raceId and file in mutationFn', async () => {
    const queryClient = new QueryClient()
    const options = getUploadRaceMapMutationOptions(queryClient, 'race-789')
    const file = new File(['content'], 'map.png', { type: 'image/png' })

    const spy = vi.spyOn(apiModule, 'uploadRaceMap').mockResolvedValueOnce({
      mapImageUrl: 'https://example.com/new-map.png',
    })

    const result = await options.mutationFn(file)

    expect(spy).toHaveBeenCalledWith('race-789', file)
    expect(result.mapImageUrl).toBe('https://example.com/new-map.png')
    spy.mockRestore()
  })

  it('invalidates buildMapQueryKeys.all and races query cache on success', () => {
    const queryClient = new QueryClient()
    const invalidateSpy = vi
      .spyOn(queryClient, 'invalidateQueries')
      .mockResolvedValue(undefined)

    const options = getUploadRaceMapMutationOptions(queryClient, 'race-789')
    options.onSuccess()

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: buildMapQueryKeys.all,
    })
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['races'],
    })
  })

  it('updates map detail query cache synchronously when data is provided on success', () => {
    const queryClient = new QueryClient()
    const setQueryDataSpy = vi.spyOn(queryClient, 'setQueryData')
    vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue(undefined)

    const options = getUploadRaceMapMutationOptions(queryClient, 'race-789')
    options.onSuccess({ mapImageUrl: 'https://example.com/cached-map.png' })

    expect(setQueryDataSpy).toHaveBeenCalledWith(
      buildMapQueryKeys.mapDetail('race-789'),
      expect.any(Function),
    )
  })
})
