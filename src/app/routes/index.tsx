import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import LoginPage from '@core/pages'

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <LoginPage />,
      },
    ],
  },
])
