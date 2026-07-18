import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './app/routes'
import { AppProviders } from './app/providers'
import { AuthInitializer } from '@/core/features/auth/components/AuthInitializer'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
    </AppProviders>
  </StrictMode>,
)
