import { useEffect, useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, MathUtils, ShaderMaterial } from 'three'
import type { BufferGeometry, LineSegments } from 'three'
import { hexToDisplayRgb } from '../../../lib/color'
import { FOG_DENSITY, PALETTE } from './constants'
import { buildDataLayer } from './dataGeometry'
import { GlowPoints, STATIC_TIME } from './GlowPoints'
import { LINE_FRAGMENT, LINE_VERTEX } from './shaders'

interface DataLayerProps {
  blend: RefObject<number>
  animated: boolean
}

interface DataLinesProps extends DataLayerProps {
  geometry: BufferGeometry
  /** Presença no modo Physical; no Digital sempre 1. */
  presenceMin: number
  gain?: number
}

function DataLines({ geometry, blend, animated, presenceMin, gain = 1 }: DataLinesProps) {
  const ref = useRef<LineSegments>(null)
  const material = useRef<ShaderMaterial>(null)
  const uniforms = useMemo(
    () => ({
      uTime: { value: STATIC_TIME },
      uPresence: { value: presenceMin },
      uFog: { value: FOG_DENSITY },
      uGain: { value: gain },
      uCyan: { value: hexToDisplayRgb(PALETTE.cyan) },
      uOrange: { value: hexToDisplayRgb(PALETTE.amber) },
    }),
    [presenceMin, gain],
  )

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((state) => {
    const lines = ref.current
    const shader = material.current
    if (!lines || !shader) return

    const presence = MathUtils.lerp(presenceMin, 1, blend.current)
    shader.uniforms.uPresence.value = presence
    shader.uniforms.uTime.value = animated ? state.clock.elapsedTime : STATIC_TIME
    lines.visible = presence > 0.004
  })

  return (
    <lineSegments ref={ref} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={LINE_VERTEX}
        fragmentShader={LINE_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </lineSegments>
  )
}

function DataLayer({ blend, animated }: DataLayerProps) {
  const data = useMemo(() => buildDataLayer(), [])

  return (
    <group>
      <DataLines geometry={data.skeleton} blend={blend} animated={animated} presenceMin={0} gain={0.35} />
      <DataLines geometry={data.traces} blend={blend} animated={animated} presenceMin={0.06} gain={1.1} />
      <DataLines geometry={data.connections} blend={blend} animated={animated} presenceMin={0.02} gain={1.3} />
      <GlowPoints data={data.nodes} blend={blend} animated={animated} presenceMin={0.2} pulse={1} fogMix={0.7} />
      <GlowPoints data={data.leds} blend={blend} animated={animated} presenceMin={1} pulse={0.4} fogMix={0.85} />
    </group>
  )
}

export default DataLayer
