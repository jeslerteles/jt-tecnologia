import type { ReactNode, RefObject } from 'react'
import ThreeScene from '../components/three/ThreeScene'
import WarehouseScene from '../components/three/warehouse/WarehouseScene'

interface HeroSceneProps {
  /** Progresso bruto da narrativa; ausente = quadro estático (movimento reduzido). */
  progress?: RefObject<number>
  paused?: boolean
  fallback: ReactNode
}

// Módulo carregado sob demanda: mantém Three.js fora do bundle inicial.
function HeroScene({ progress, paused, fallback }: HeroSceneProps) {
  return (
    <ThreeScene
      reducedMotion="static"
      paused={paused}
      fallback={fallback}
      loadingFallback={fallback}
    >
      <WarehouseScene mode="physical" scrollProgress={progress} />
    </ThreeScene>
  )
}

export default HeroScene
