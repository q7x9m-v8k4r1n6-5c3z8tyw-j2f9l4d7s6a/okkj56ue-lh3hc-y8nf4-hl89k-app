import { createBrowserRouter } from 'react-router-dom'
import App from '@/src/app/App'
import {
  NotFoundPage,
  PrototypePage,
  RaceListPage,
  SettingsPage,
  UserPage,
  CreatePageRace,
} from '@/core/pages'

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        index: true,
        element: <RaceListPage />,
      },
      {
        path: 'users',
        element: <UserPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'prototype',
        element: <PrototypePage />,
      },
      {
        path: 'create-race',
        element: <CreatePageRace />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
