import { describe, expect, it, vi } from 'vitest'
import { createAsyncActionLock } from './asyncActionLock'

describe('createAsyncActionLock', () => {
  it('ignores repeated submit or cancel clicks while the first action is pending', async () => {
    let releaseAction: (() => void) | undefined
    const pendingAction = new Promise<void>((resolve) => {
      releaseAction = resolve
    })
    const action = vi.fn(() => pendingAction)
    const lock = createAsyncActionLock()

    const firstRun = lock.run(action)
    const duplicateRun = lock.run(action)

    expect(await duplicateRun).toBe(false)
    expect(action).toHaveBeenCalledTimes(1)

    releaseAction?.()
    expect(await firstRun).toBe(true)
  })

  it('unlocks after an action finishes', async () => {
    const action = vi.fn(async () => undefined)
    const lock = createAsyncActionLock()

    await lock.run(action)
    await lock.run(action)

    expect(action).toHaveBeenCalledTimes(2)
  })
})
