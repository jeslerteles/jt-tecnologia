import { lazy, Suspense } from 'react'
import { LAB_PATH, usePathname } from './lib/navigation'
import LandingPage from './pages/LandingPage'

const Lab3DPage = lazy(() => import('./pages/Lab3DPage'))

function App() {
  const pathname = usePathname()

  if (pathname === LAB_PATH) {
    return (
      <Suspense fallback={null}>
        <Lab3DPage />
      </Suspense>
    )
  }

  return <LandingPage />
}

export default App
