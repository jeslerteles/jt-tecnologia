import { Component, lazy, Suspense } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const SceneCanvas = lazy(() => import('./SceneCanvas'))

interface ThreeSceneProps {
  children?: ReactNode
  className?: string
  /** Exibido se a cena falhar ou, em 'fallback', sob movimento reduzido. */
  fallback?: ReactNode
  /** Exibido enquanto o Canvas e a cena são carregados. */
  loadingFallback?: ReactNode
  /**
   * 'fallback' (padrão) não monta o Canvas sob movimento reduzido.
   * 'static' monta a cena sem loop contínuo, redesenhando sob demanda.
   */
  reducedMotion?: 'fallback' | 'static'
  /** Suspende o loop de renderização (ex.: cena fora da viewport). */
  paused?: boolean
}

interface SceneErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

interface SceneErrorBoundaryState {
  hasError: boolean
}

class SceneErrorBoundary extends Component<
  SceneErrorBoundaryProps,
  SceneErrorBoundaryState
> {
  state: SceneErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Three.js scene failed to render.', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

function DefaultFallback() {
  return (
    <div className="three-scene-fallback" role="status">
      Cena 3D indisponível.
    </div>
  )
}

function ThreeScene({
  children,
  className,
  fallback,
  loadingFallback,
  reducedMotion = 'fallback',
  paused = false,
}: ThreeSceneProps) {
  const prefersReducedMotion = useReducedMotion()
  const visualFallback = fallback ?? <DefaultFallback />

  if (prefersReducedMotion && reducedMotion === 'fallback') {
    return <>{visualFallback}</>
  }

  return (
    <SceneErrorBoundary fallback={visualFallback}>
      <Suspense fallback={loadingFallback ?? visualFallback}>
        <SceneCanvas
          className={className}
          frameloop={paused ? 'never' : prefersReducedMotion ? 'demand' : 'always'}
        >
          {children}
        </SceneCanvas>
      </Suspense>
    </SceneErrorBoundary>
  )
}

export default ThreeScene
