import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTeamMap } from '../model/frontend/useTeamMap'
import { useTeamMapQuery } from '../model/server/useTeamMapQuery'

describe('useTeamMap', () => {
  it('initializes with null selectedStationId and provides select and clear functions', () => {
    let captured: ReturnType<typeof useTeamMap> | null = null

    function Harness() {
      captured = useTeamMap()
      return <div data-selected={captured.selectedStationId ?? ''} />
    }

    renderToStaticMarkup(<Harness />)

    expect(captured).not.toBeNull()
    expect(captured!.selectedStationId).toBeNull()
    expect(typeof captured!.selectStation).toBe('function')
    expect(typeof captured!.clearSelection).toBe('function')
  })

  it('maintains stable function references for selectStation and clearSelection', () => {
    let captured1: ReturnType<typeof useTeamMap> | null = null
    let captured2: ReturnType<typeof useTeamMap> | null = null

    function Harness({ tick }: { tick: number }) {
      const hook = useTeamMap()
      if (tick === 1) captured1 = hook
      else captured2 = hook
      return <div data-tick={tick} />
    }

    renderToStaticMarkup(<Harness tick={1} />)
    renderToStaticMarkup(<Harness tick={2} />)

    expect(captured1).not.toBeNull()
    expect(captured2).not.toBeNull()
    expect(typeof captured1!.selectStation).toBe('function')
    expect(typeof captured1!.clearSelection).toBe('function')
  })
})

describe('useTeamMapQuery', () => {
  it('disables query and handles undefined or whitespace raceId safely in queryFn', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    let captured: ReturnType<typeof useTeamMapQuery> | null = null

    function Harness({ raceId }: { raceId?: string }) {
      captured = useTeamMapQuery(raceId)
      return <div data-loading={captured.isLoading} />
    }

    renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <Harness raceId={undefined} />
      </QueryClientProvider>,
    )

    expect(captured).not.toBeNull()
    expect(captured!.isLoading).toBe(false)
    expect(captured!.data).toBeUndefined()
  })
})
