import type { HubConnection } from '@microsoft/signalr'
import { describe, expect, it, vi } from 'vitest'
import { startTeamBoothSignalRSession } from './teamBoothSignalRSession'

type Handler = (...args: string[]) => void

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
    const onEntryRejected = vi.fn()
    const onSessionCancelled = vi.fn()

    startTeamBoothSignalRSession({
      connection: realtime.connection,
      onEntryRejected,
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

  it('joins the race group again after reconnect', async () => {
    const realtime = createConnection()

    startTeamBoothSignalRSession({
      connection: realtime.connection,
      onEntryRejected: vi.fn(),
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
  })
})
