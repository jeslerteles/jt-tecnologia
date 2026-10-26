import { lazy, Suspense } from 'react'
import { LAB_PATH, usePathname } from './lib/navigation'
import { LanguageProvider } from './lib/LanguageProvider'
import LandingPage from './pages/LandingPage'

const Lab3DPage = lazy(() => import('./pages/Lab3DPage'))

function App() {
  const pathname = usePathname()

  return (
    <LanguageProvider>
      {pathname === LAB_PATH ? (
        <Suspense fallback={null}>
          <Lab3DPage />
        </Suspense>
      ) : (
        <LandingPage />
      )}
    </LanguageProvider>
  )
}

export default App
