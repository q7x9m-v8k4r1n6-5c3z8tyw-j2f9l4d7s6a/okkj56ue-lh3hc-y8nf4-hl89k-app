import { useEffect, useState } from 'react'

/** Returns the latest value only after it remains unchanged for the delay. */
export const useDebouncedValue = <T,>(value: T, delayMs = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setDebouncedValue(value),
      delayMs,
    )
    return () => window.clearTimeout(timeoutId)
  }, [delayMs, value])

  return debouncedValue
}
