import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { ConfirmDialogProvider, ToastProvider } from '@/core/shared'
import { store } from '../store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export const AppProviders = ({ children }: PropsWithChildren) => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
      </ToastProvider>
    </QueryClientProvider>
  </Provider>
)