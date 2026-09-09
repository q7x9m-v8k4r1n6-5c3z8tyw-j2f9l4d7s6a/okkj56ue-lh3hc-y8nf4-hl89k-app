import { describe, expect, it, vi } from 'vitest'
import { client } from '@/core/shared/api'
import {
  getRaceBooths,
  getRaceMapDetail,
  updateBoothCoordinates,
  uploadRaceMap,
} from './buildMap.api'

describe('buildMap.api', () => {
  it('calls GET /Race/{raceId} for map details', async () => {
    const mockDetail = {
      id: '11111111-1111-4111-8111-111111111111',
      mapImageUrl: 'https://example.com/map.jpg',
    }
    const spy = vi.spyOn(client, 'request').mockResolvedValueOnce(mockDetail)

    const result = await getRaceMapDetail('11111111-1111-4111-8111-111111111111')

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/Race/11111111-1111-4111-8111-111111111111',
      }),
    )
    expect(result.mapImageUrl).toBe('https://example.com/map.jpg')
    spy.mockRestore()
  })

  it('calls GET /Race/booth-list with raceId query', async () => {
    const mockBooths = [
      {
        boothId: '22222222-2222-4222-8222-222222222222',
        boothName: 'Trạm 1',
        isHidden: false,
      },
    ]
    const spy = vi.spyOn(client, 'request').mockResolvedValueOnce(mockBooths)

    const result = await getRaceBooths('race-123')

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/Race/booth-list',
        query: { raceId: 'race-123' },
      }),
    )
    expect(result).toHaveLength(1)
    expect(result[0].boothName).toBe('Trạm 1')
    spy.mockRestore()
  })

  it('calls POST /Race/{raceId}/map with multipart form data', async () => {
    const mockResponse = {
      mapImageUrl: 'https://example.com/uploaded.png',
    }
    const spy = vi.spyOn(client, 'request').mockResolvedValueOnce(mockResponse)

    const fakeFile = new File(['content'], 'map.png', { type: 'image/png' })
    const result = await uploadRaceMap('race-456', fakeFile)

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/Race/race-456/map',
        method: 'POST',
      }),
    )
    expect(result.mapImageUrl).toBe('https://example.com/uploaded.png')
    spy.mockRestore()
  })

  it('forwards AbortSignal to client.request', async () => {
    const controller = new AbortController()
    const spy = vi.spyOn(client, 'request').mockResolvedValueOnce({
      id: 'race-999',
      mapImageUrl: null,
    })

    await getRaceMapDetail('race-999', controller.signal)

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        signal: controller.signal,
      }),
    )
    spy.mockRestore()
  })

  it('throws when response fails schema validation', async () => {
    vi.spyOn(client, 'request').mockResolvedValueOnce({ invalid: true })

    await expect(getRaceMapDetail('race-err')).rejects.toThrow()
    vi.restoreAllMocks()
  })

  it('propagates client request error when upload fails', async () => {
    vi.spyOn(client, 'request').mockRejectedValueOnce(new Error('Network failure'))

    const fakeFile = new File(['content'], 'map.png', { type: 'image/png' })
    await expect(uploadRaceMap('race-err', fakeFile)).rejects.toThrow('Network failure')
    vi.restoreAllMocks()
  })

  it('rejects with error when raceId is empty or whitespace', async () => {
    const fakeFile = new File(['content'], 'map.png', { type: 'image/png' })

    await expect(getRaceMapDetail('')).rejects.toThrow('Mã trận đấu không hợp lệ.')
    await expect(getRaceMapDetail('   ')).rejects.toThrow('Mã trận đấu không hợp lệ.')
    await expect(getRaceBooths('')).rejects.toThrow('Mã trận đấu không hợp lệ.')
    await expect(getRaceBooths('   ')).rejects.toThrow('Mã trận đấu không hợp lệ.')
    await expect(uploadRaceMap('', fakeFile)).rejects.toThrow('Mã trận đấu không hợp lệ.')
    await expect(uploadRaceMap('   ', fakeFile)).rejects.toThrow('Mã trận đấu không hợp lệ.')
    await expect(
      updateBoothCoordinates('', { coordinates: [] }),
    ).rejects.toThrow('Mã trận đấu không hợp lệ.')
    await expect(
      updateBoothCoordinates('   ', { coordinates: [] }),
    ).rejects.toThrow('Mã trận đấu không hợp lệ.')
  })

  it('calls PUT /Race/{raceId}/booths/coordinates with payload', async () => {
    const spy = vi.spyOn(client, 'request').mockResolvedValueOnce({ success: true })

    const payload = {
      coordinates: [
        { boothId: 'b-1', mapX: 50, mapY: 60 },
        { boothId: 'b-2', mapX: 10, mapY: 20 },
      ],
    }
    const result = await updateBoothCoordinates('race-123', payload)

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/Race/race-123/booths/coordinates',
        method: 'PUT',
        body: payload,
      }),
    )
    expect(result).toEqual({ success: true })
    spy.mockRestore()
  })
})
