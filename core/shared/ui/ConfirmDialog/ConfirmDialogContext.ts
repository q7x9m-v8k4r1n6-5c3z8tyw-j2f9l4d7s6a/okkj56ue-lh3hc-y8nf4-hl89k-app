import { createContext } from 'react'
import type { ConfirmDialogOptions } from './useConfirmDialog'

export type ConfirmDialogContextValue = {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>
}

export const ConfirmDialogContext = createContext<ConfirmDialogContextValue | null>(null)