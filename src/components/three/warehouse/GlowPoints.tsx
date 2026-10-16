import { useEffect, useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  MathUtils,
  Points,
  ShaderMaterial,
} from 'three'
import type { PerspectiveCamera } from 'three'
import { FOG_DENSITY } from './constants'
import { POINT_FRAGMENT, POINT_VERTEX } from './shaders'

// Tempo fixo usado quando a animação está desativada (movimento reduzido).
export const STATIC_TIME = 3.7

export interface GlowPointsData {
  positions: Float32Array
  /** RGB de exibição (0-1), 3 valores por ponto. */
  colors: Float32Array
  sizes: Float32Array
  phases: Float32Array
}

interface GlowPointsProps {
  data: GlowPointsData
  blend: RefObject<number>
  animated: boolean
  /** Presença no modo Physical; no Digital sempre 1. */
  presenceMin: number
  pulse?: number
  fogMix?: number
  intensity?: number
}

export function GlowPoints({
  data,
  blend,
  animated,
  presenceMin,
  pulse = 0,
  fogMix = 0.6,
  intensity = 1,
}: GlowPointsProps) {
  const ref = useRef<Points>(null)
  const material = useRef<ShaderMaterial>(null)

  const geometry = useMemo(() => {
    const result = new BufferGeometry()
    result.setAttribute('position', new Float32BufferAttribute(data.positions, 3))
    result.setAttribute('aColor', new Float32BufferAttribute(data.colors, 3))
    result.setAttribute('aSize', new Float32BufferAttribute(data.sizes, 1))
    result.setAttribute('aPhase', new Float32BufferAttribute(data.phases, 1))
    return result
  }, [data])

  const uniforms = useMemo(
    () => ({
      uScale: { value: 1000 },
      uTime: { value: STATIC_TIME },
      uPulse: { value: pulse },
      uPresence: { value: presenceMin },
      uFog: { value: FOG_DENSITY },
      uFogMix: { value: fogMix },
      uIntensity: { value: intensity },
    }),
    [pulse, presenceMin, fogMix, intensity],
  )

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((state) => {
    const points = ref.current
    const shader = material.current
    if (!points || !shader) return

    const camera = state.camera as PerspectiveCamera
    const presence = MathUtils.lerp(presenceMin, 1, blend.current)

    shader.uniforms.uPresence.value = presence
    shader.uniforms.uTime.value = animated ? state.clock.elapsedTime : STATIC_TIME
    shader.uniforms.uScale.value =
      (state.size.height * state.viewport.dpr) /
      (2 * Math.tan(MathUtils.degToRad(camera.fov) / 2))
    points.visible = presence > 0.004
  })

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={POINT_VERTEX}
        fragmentShader={POINT_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  )
}
