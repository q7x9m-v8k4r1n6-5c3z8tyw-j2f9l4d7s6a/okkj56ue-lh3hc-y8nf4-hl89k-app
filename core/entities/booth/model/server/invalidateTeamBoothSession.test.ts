import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { invalidateTeamBoothSession } from './invalidateTeamBoothSession'

describe('invalidateTeamBoothSession', () => {
  it('invalidates only the current race team-session query', async () => {
    const queryClient = new QueryClient()
    const invalidate = vi
      .spyOn(queryClient, 'invalidateQueries')
      .mockResolvedValue(undefined)

    await invalidateTeamBoothSession(queryClient, 'race-1')

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ['team', 'booth-session', 'race-1'],
    })
  })
})
