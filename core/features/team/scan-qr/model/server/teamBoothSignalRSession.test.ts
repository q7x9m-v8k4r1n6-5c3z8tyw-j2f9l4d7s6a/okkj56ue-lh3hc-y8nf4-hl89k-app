import type { HubConnection } from '@microsoft/signalr'
import { describe, expect, it, vi } from 'vitest'
import { startTeamBoothSignalRSession } from './teamBoothSignalRSession'

type Handler = (...args: unknown[]) => void

const createConnection = () => {
  const handlers = new Map<string, Handler>()
  let reconnectHandler: (() => void) | undefined
  const invoke = vi.fn(async () => undefined)

  const connection = {
    invoke,
    off: vi.fn((eventName: string) => handlers.delete(eventName)),
    on: vi.fn((eventName: string, handler: Handler) => {
      handlers.set(eventName, handler)
    }),
    onreconnected: vi.fn((handler: () => void) => {
      reconnectHandler = handler
    }),
    start: vi.fn(async () => undefined),
    stop: vi.fn(async () => undefined),
  } as unknown as HubConnection

  return {
    connection,
    handlers,
    invoke,
    reconnect: () => reconnectHandler?.(),
  }
}

const flushPromises = async () => {
  await Promise.resolve()
  await Promise.resolve()
}

describe('startTeamBoothSignalRSession', () => {
  it('handles rejected and cancelled events only for the current team', () => {
    const realtime = createConnection()
    const onBoothStatusChanged = vi.fn()
    const onBoothCompleted = vi.fn()
    const onEntryRejected = vi.fn()
    const onReconnected = vi.fn()
    const onSessionCancelled = vi.fn()

    startTeamBoothSignalRSession({
      connection: realtime.connection,
      getActiveBoothId: () => undefined,
      onBoothStatusChanged,
      onBoothCompleted,
      onEntryRejected,
      onReconnected,
      onSessionCancelled,
      raceId: 'race-1',
      teamId: 'TEAM-A',
    })

    realtime.handlers.get('ReceiveBoothEntryRejected')?.('booth-1', 'team-b')
    realtime.handlers.get('ReceiveBoothEntryCancelled')?.('booth-1', 'team-b')
    realtime.handlers.get('ReceiveBoothEntryRejected')?.('booth-2', 'team-a')
    realtime.handlers.get('ReceiveBoothEntryCancelled')?.('booth-2', 'team-a')

    expect(onEntryRejected).toHaveBeenCalledOnce()
    expect(onEntryRejected).toHaveBeenCalledWith('booth-2')
    expect(onSessionCancelled).toHaveBeenCalledOnce()
    expect(onSessionCancelled).toHaveBeenCalledWith('booth-2')
  })

  it('forwards completion only for the authenticated team', () => {
    const realtime = createConnection()
    const onBoothCompleted = vi.fn()

    startTeamBoothSignalRSession({
      connection: realtime.connection,
      getActiveBoothId: () => 'booth-1',
      onBoothCompleted,
      onBoothStatusChanged: vi.fn(),
      onEntryRejected: vi.fn(),
      onReconnected: vi.fn(),
      onSessionCancelled: vi.fn(),
      raceId: 'race-1',
      teamId: 'team-a',
    })

    realtime.handlers.get('ReceiveBoothCompleted')?.(
      'booth-1',
      'team-b',
      'Trạm B',
      30,
    )
    realtime.handlers.get('ReceiveBoothCompleted')?.(
      'booth-1',
      'TEAM-A',
      'Trạm A',
      50,
    )

    expect(onBoothCompleted).toHaveBeenCalledOnce()
    expect(onBoothCompleted).toHaveBeenCalledWith('booth-1', 'Trạm A', 50)
  })

  it('forwards booth status changes so the query layer can refresh DB state', () => {
    const realtime = createConnection()
    const onBoothStatusChanged = vi.fn()

    startTeamBoothSignalRSession({
      connection: realtime.connection,
      getActiveBoothId: () => 'booth-1',
      onBoothStatusChanged,
      onBoothCompleted: vi.fn(),
      onEntryRejected: vi.fn(),
      onReconnected: vi.fn(),
      onSessionCancelled: vi.fn(),
      raceId: 'race-1',
      teamId: 'team-a',
    })

    realtime.handlers.get('ReceiveBoothStatusChanged')?.(
      'booth-unrelated',
      'occupied',
      'team-b',
    )
    realtime.handlers.get('ReceiveBoothStatusChanged')?.(
      'booth-1',
      'free',
    )
    realtime.handlers.get('ReceiveBoothStatusChanged')?.(
      'booth-2',
      'occupied',
      'TEAM-A',
    )

    expect(onBoothStatusChanged).toHaveBeenCalledTimes(2)
    expect(onBoothStatusChanged).toHaveBeenNthCalledWith(
      1,
      'booth-1',
      'free',
      undefined,
    )
    expect(onBoothStatusChanged).toHaveBeenNthCalledWith(
      2,
      'booth-2',
      'occupied',
      'TEAM-A',
    )
  })

  it('joins the race group again after reconnect', async () => {
    const realtime = createConnection()
    const onReconnected = vi.fn()

    startTeamBoothSignalRSession({
      connection: realtime.connection,
      getActiveBoothId: () => undefined,
      onBoothStatusChanged: vi.fn(),
      onBoothCompleted: vi.fn(),
      onEntryRejected: vi.fn(),
      onReconnected,
      onSessionCancelled: vi.fn(),
      raceId: 'race-1',
      teamId: 'team-a',
    })
    await flushPromises()
    realtime.reconnect()
    await flushPromises()

    expect(realtime.invoke).toHaveBeenCalledTimes(2)
    expect(realtime.invoke).toHaveBeenNthCalledWith(1, 'JoinRaceGroup', 'race-1')
    expect(realtime.invoke).toHaveBeenNthCalledWith(2, 'JoinRaceGroup', 'race-1')
    expect(onReconnected).toHaveBeenCalledOnce()
  })
})
