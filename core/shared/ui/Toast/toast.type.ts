export type ToastVariant = 'success' | 'info' | 'warning' | 'danger'

export type ToastOptions = {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

export type ToastItem = Required<Pick<ToastOptions, 'title' | 'variant' | 'duration'>> &
  Pick<ToastOptions, 'description'> & {
    id: string
  }

export type ToastContextValue = {
  toast: (options: ToastOptions) => string
  dismiss: (id: string) => void
  dismissAll: () => void
}
