import { useCallback } from 'react'
import {
  unstable_usePrompt,
  useBeforeUnload,
} from 'react-router-dom'

/**
 * Warns before browser or client-side navigation discards local changes.
 */
export const useUnsavedChangesWarning = (when: boolean) => {
  useBeforeUnload(
    useCallback(
      (event) => {
        if (!when) return
        event.preventDefault()
      },
      [when],
    ),
  )

  unstable_usePrompt({
    message: 'Bạn có thay đổi chưa lưu. Bạn có chắc muốn rời khỏi trang?',
    when,
  })
}
