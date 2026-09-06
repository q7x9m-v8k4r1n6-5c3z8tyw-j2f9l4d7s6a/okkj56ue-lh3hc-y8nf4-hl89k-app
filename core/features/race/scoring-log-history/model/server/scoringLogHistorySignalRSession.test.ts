import type { HubConnection } from '@microsoft/signalr'
import { describe, expect, it, vi } from 'vitest'
import { startScoringLogHistorySignalRSession } from './scoringLogHistorySignalRSession'

type Handler = (...args: string[]) => void

const createConnection = () => {
  const handlers = new Map<string, Handler>()
  let reconnectHandler: (() => void) | undefined
  const invoke = vi.fn(async () => undefined)
  const off = vi.fn((eventName: string) => handlers.delete(eventName))
  const stop = vi.fn(async () => undefined)
  const connection = {
    invoke,
    off,
    on: vi.fn((eventName: string, handler: Handler) => {
      handlers.set(eventName, handler)
    }),
    onreconnected: vi.fn((handler: () => void) => {
      reconnectHandler = handler
    }),
    start: vi.fn(async () => undefined),
    stop,
  } as unknown as HubConnection

  return {
    connection,
    handlers,
    invoke,
    off,
    reconnect: () => reconnectHandler?.(),
    stop,
  }
}

const flushPromises = async () => {
  await Promise.resolve()
  await Promise.resolve()
}

describe('startScoringLogHistorySignalRSession', () => {
  it('refreshes only when the changed race matches', () => {
    const realtime = createConnection()
    const onRaceScoreChanged = vi.fn()

    startScoringLogHistorySignalRSession({
      connection: realtime.connection,
      onRaceScoreChanged,
      onReconnected: vi.fn(),
      raceId: 'RACE-A',
    })
    realtime.handlers.get('ReceiveRaceScoreChanged')?.('race-b')
    realtime.handlers.get('ReceiveRaceScoreChanged')?.('race-a')

    expect(onRaceScoreChanged).toHaveBeenCalledOnce()
  })

  it('rejoins and refreshes after reconnect', async () => {
    const realtime = createConnection()
    const onReconnected = vi.fn()

    startScoringLogHistorySignalRSession({
      connection: realtime.connection,
      onRaceScoreChanged: vi.fn(),
      onReconnected,
      raceId: 'race-a',
    })
    await flushPromises()
    realtime.reconnect()
    await flushPromises()

    expect(realtime.invoke).toHaveBeenNthCalledWith(1, 'JoinRaceGroup', 'race-a')
    expect(realtime.invoke).toHaveBeenNthCalledWith(2, 'JoinRaceGroup', 'race-a')
    expect(onReconnected).toHaveBeenCalledOnce()
  })

  it('unregisters the event and stops on cleanup', () => {
    const realtime = createConnection()
    const cleanup = startScoringLogHistorySignalRSession({
      connection: realtime.connection,
      onRaceScoreChanged: vi.fn(),
      onReconnected: vi.fn(),
      raceId: 'race-a',
    })

    cleanup()

    expect(realtime.off).toHaveBeenCalledWith(
      'ReceiveRaceScoreChanged',
      expect.any(Function),
    )
    expect(realtime.invoke).toHaveBeenCalledWith('LeaveRaceGroup', 'race-a')
    expect(realtime.stop).toHaveBeenCalledOnce()
  })
})
