import { createContext } from 'react'
import type { ToastContextValue } from './toast.type'

export const ToastContext = createContext<ToastContextValue | null>(null)
