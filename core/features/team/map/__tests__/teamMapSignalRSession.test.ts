import type { HubConnection } from '@microsoft/signalr'
import { describe, expect, it, vi } from 'vitest'
import { startTeamMapSignalRSession } from '../model/server/teamMapSignalRSession'

type Handler = (...args: string[]) => void

const createConnection = () => {
  const handlers = new Map<string, Handler>()
  let reconnectHandler: (() => void) | undefined
  const invoke = vi.fn(async (method?: string) => {
    void method
    return undefined
  })
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

describe('startTeamMapSignalRSession', () => {
  it('catches ReceiveBoothStatusChanged and triggers onBoothStatusChanged with boothId and status', () => {
    const realtime = createConnection()
    const onBoothStatusChanged = vi.fn()

    startTeamMapSignalRSession({
      connection: realtime.connection,
      onBoothStatusChanged,
      onReconnected: vi.fn(),
      raceId: 'race-123',
    })

    const handler = realtime.handlers.get('ReceiveBoothStatusChanged')
    expect(handler).toBeDefined()

    handler?.('booth-1', 'occupied', 'team-99', 'Warriors')
    expect(onBoothStatusChanged).toHaveBeenCalledWith('booth-1', 'occupied')

    handler?.('booth-2', 'free')
    expect(onBoothStatusChanged).toHaveBeenCalledWith('booth-2', 'free')
  })

  it('automatically rejoins race group and triggers onReconnected after reconnect', async () => {
    const realtime = createConnection()
    const onReconnected = vi.fn()

    startTeamMapSignalRSession({
      connection: realtime.connection,
      onBoothStatusChanged: vi.fn(),
      onReconnected,
      raceId: 'race-123',
    })

    await flushPromises()
    realtime.reconnect()
    await flushPromises()

    expect(realtime.invoke).toHaveBeenNthCalledWith(1, 'JoinRaceGroup', 'race-123')
    expect(realtime.invoke).toHaveBeenNthCalledWith(2, 'JoinRaceGroup', 'race-123')
    expect(onReconnected).toHaveBeenCalledOnce()
  })

  it('unregisters the event, leaves race group, and stops on cleanup', () => {
    const realtime = createConnection()
    const cleanup = startTeamMapSignalRSession({
      connection: realtime.connection,
      onBoothStatusChanged: vi.fn(),
      onReconnected: vi.fn(),
      raceId: 'race-123',
    })

    cleanup()

    expect(realtime.off).toHaveBeenCalledWith(
      'ReceiveBoothStatusChanged',
      expect.any(Function),
    )
    expect(realtime.invoke).toHaveBeenCalledWith('LeaveRaceGroup', 'race-123')
    expect(realtime.stop).toHaveBeenCalledOnce()
  })

  it('logs error when connection.start() fails', async () => {
    const realtime = createConnection()
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const startError = new Error('Connection failed')
    realtime.connection.start = vi.fn().mockRejectedValue(startError)

    startTeamMapSignalRSession({
      connection: realtime.connection,
      onBoothStatusChanged: vi.fn(),
      onReconnected: vi.fn(),
      raceId: 'race-123',
    })

    await flushPromises()

    expect(consoleSpy).toHaveBeenCalledWith(
      'Không thể kết nối cập nhật trạm realtime:',
      startError,
    )
    consoleSpy.mockRestore()
  })

  it('swallows LeaveRaceGroup failure and stops connection during cleanup', async () => {
    const realtime = createConnection()
    realtime.invoke.mockImplementation(async (method?: string) => {
      if (method === 'LeaveRaceGroup') {
        throw new Error('Leave error')
      }
      return undefined
    })

    const cleanup = startTeamMapSignalRSession({
      connection: realtime.connection,
      onBoothStatusChanged: vi.fn(),
      onReconnected: vi.fn(),
      raceId: 'race-123',
    })

    expect(() => cleanup()).not.toThrow()
    await flushPromises()
    expect(realtime.stop).toHaveBeenCalledOnce()
  })
})
