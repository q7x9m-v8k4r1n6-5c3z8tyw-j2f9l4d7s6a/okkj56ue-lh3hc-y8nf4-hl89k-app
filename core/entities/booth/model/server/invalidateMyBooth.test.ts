import { QueryClient, QueryObserver } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { invalidateMyBooth } from './invalidateMyBooth'

describe('invalidateMyBooth', () => {
  it('invalidates the current race booth query so active views refetch DB state', async () => {
    const queryClient = new QueryClient()
    const invalidate = vi
      .spyOn(queryClient, 'invalidateQueries')
      .mockResolvedValue(undefined)

    await invalidateMyBooth(queryClient, 'race-1')

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ['booth', 'my-booth', 'race-1'],
    })
  })

  it('refetches an active my-booth query after a successful workflow mutation', async () => {
    const queryClient = new QueryClient()
    const queryFn = vi.fn(async () => ({ boothId: 'booth-1' }))
    const queryKey = ['booth', 'my-booth', 'race-1'] as const
    await queryClient.fetchQuery({ queryKey, queryFn, staleTime: Infinity })
    const observer = new QueryObserver(queryClient, {
      queryKey,
      queryFn,
      staleTime: Infinity,
    })
    const unsubscribe = observer.subscribe(() => undefined)

    await invalidateMyBooth(queryClient, 'race-1')

    expect(queryFn).toHaveBeenCalledTimes(2)
    unsubscribe()
  })
})
