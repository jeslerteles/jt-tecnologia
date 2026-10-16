import { Canvas } from '@react-three/fiber'
import type { ReactNode } from 'react'
import { ACESFilmicToneMapping } from 'three'

interface SceneCanvasProps {
  children?: ReactNode
  className?: string
  frameloop?: 'always' | 'demand' | 'never'
}

function SceneCanvas({
  children,
  className,
  frameloop = 'always',
}: SceneCanvasProps) {
  return (
    <Canvas
      className={className}
      frameloop={frameloop}
      camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 220 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
    >
      {children}
    </Canvas>
  )
}

export default SceneCanvas
