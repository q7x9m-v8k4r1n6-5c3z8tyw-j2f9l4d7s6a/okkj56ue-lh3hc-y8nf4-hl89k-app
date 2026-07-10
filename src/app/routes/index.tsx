import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import { RaceListPage, SettingsPage, UserPage } from '@core/pages'

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
    ],
  },
])
