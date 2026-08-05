import { useContext } from 'react'
import { ConfirmDialogContext } from './ConfirmDialogContext'

export type ConfirmDialogOptions = {
  title: string
  description?: string
}

export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext)

  if (!context) {
    throw new Error('useConfirmDialog must be used inside ConfirmDialogProvider')
  }

  return context
}