import { createBrowserRouter } from 'react-router-dom'
import App from '@/src/app/App'
import {
  NotFoundPage,
  PrototypePage,
  RaceDetailPage,
  RaceFormPage,
  RaceListPage,
  SettingsPage,
  UserPage,
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
        path: 'races/new',
        element: <RaceFormPage mode="create" />,
      },
      {
        path: 'races/:raceId',
        element: <RaceDetailPage />,
      },
      {
        path: 'races/:raceId/edit',
        element: <RaceFormPage mode="edit" />,
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
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
