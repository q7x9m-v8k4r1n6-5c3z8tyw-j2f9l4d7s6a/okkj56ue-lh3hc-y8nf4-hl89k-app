export const createAsyncActionLock = () => {
  let isLocked = false

  return {
    run: async (action: () => Promise<void>) => {
      if (isLocked) return false

      isLocked = true
      try {
        await action()
        return true
      } finally {
        isLocked = false
      }
    },
  }
}
