import { Outlet } from 'react-router-dom'
import { AppLayout } from '@/core/shared'

function App() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

export default App
