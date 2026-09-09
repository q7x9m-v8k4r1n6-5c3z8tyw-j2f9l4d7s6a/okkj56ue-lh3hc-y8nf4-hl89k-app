import { describe, expect, it, vi } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import { teamMapQueryKeys } from '../model/server/teamMap.queryKeys'
import type { TeamMapDetailResponse } from '../model/teamMap.contract'

describe('useTeamMapSignalR cache updater logic', () => {
  const isSameId = (
    left?: string | number | null,
    right?: string | number | null,
  ) =>
    left != null &&
    right != null &&
    String(left).trim().toLowerCase() === String(right).trim().toLowerCase()

  const updateBoothStatusInCache = (
    queryClient: QueryClient,
    raceId: string,
    boothId: string,
    newStatus: string,
  ) => {
    queryClient.setQueryData<TeamMapDetailResponse>(
      teamMapQueryKeys.detail(raceId),
      (oldData) => {
        if (!oldData || !oldData.booth) return oldData
        const updatedBooth = oldData.booth.map((booth) =>
          isSameId(booth.id, boothId) || isSameId(booth.boothId, boothId)
            ? { ...booth, status: newStatus }
            : booth,
        )
        return {
          ...oldData,
          booth: updatedBooth,
        }
      },
    )

    void queryClient.invalidateQueries({
      queryKey: teamMapQueryKeys.detail(raceId),
    })
  }

  it('updates matching booth status by id or boothId (case-insensitive) and invalidates queries', () => {
    const queryClient = new QueryClient()
    const raceId = 'race-123'
    const initialData: TeamMapDetailResponse = {
      id: raceId,
      name: 'Giải Chạy 2026',
      mapImageUrl: 'https://example.com/map.jpg',
      booth: [
        {
          id: 'booth-1',
          name: 'Trạm 1',
          place: 'Cổng 1',
          description: 'Mô tả 1',
          isHidden: false,
          status: 'free',
          mapX: 10,
          mapY: 20,
        },
        {
          id: 'booth-2',
          name: 'Trạm 2',
          place: 'Cổng 2',
          description: 'Mô tả 2',
          isHidden: false,
          status: 'occupied',
          mapX: 30,
          mapY: 40,
        },
      ],
    }

    queryClient.setQueryData(teamMapQueryKeys.detail(raceId), initialData)
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    updateBoothStatusInCache(queryClient, raceId, 'BOOTH-1', 'occupied')

    const cachedData = queryClient.getQueryData<TeamMapDetailResponse>(
      teamMapQueryKeys.detail(raceId),
    )

    expect(cachedData?.booth[0].status).toBe('occupied')
    expect(cachedData?.booth[1].status).toBe('occupied')
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: teamMapQueryKeys.detail(raceId),
    })
  })

  it('handles empty or missing booth data gracefully', () => {
    const queryClient = new QueryClient()
    const raceId = 'race-empty'

    expect(() => {
      updateBoothStatusInCache(queryClient, raceId, 'booth-1', 'occupied')
    }).not.toThrow()

    const cached = queryClient.getQueryData(teamMapQueryKeys.detail(raceId))
    expect(cached).toBeUndefined()
  })
})
