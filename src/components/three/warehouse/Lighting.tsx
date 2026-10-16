import { useRef } from 'react'
import type { RefObject } from 'react'
import { Environment, Lightformer } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'
import type { AmbientLight, HemisphereLight, PointLight } from 'three'

interface LightingProps {
  blend: RefObject<number>
}

// Poças de luz quente ao longo do corredor: criam contraste entre primeiro plano, plano médio e fundo.
const WARM_LIGHT_Z = [12, -10, -32, -54, -74] as const

interface LightLevel {
  physical: number
  digital: number
}

function level(light: LightLevel, t: number) {
  return MathUtils.lerp(light.physical, light.digital, t)
}

const HEMISPHERE: LightLevel = { physical: 0.55, digital: 0.4 }
const AMBIENT: LightLevel = { physical: 0.18, digital: 0.14 }
const WARM: LightLevel = { physical: 340, digital: 120 }
const COOL: LightLevel = { physical: 300, digital: 520 }
const ENVIRONMENT: LightLevel = { physical: 0.7, digital: 0.3 }

function Lighting({ blend }: LightingProps) {
  const hemisphere = useRef<HemisphereLight>(null)
  const ambient = useRef<AmbientLight>(null)
  const warm = useRef<(PointLight | null)[]>([])
  const cool = useRef<PointLight>(null)

  useFrame((state) => {
    const t = blend.current

    if (hemisphere.current) hemisphere.current.intensity = level(HEMISPHERE, t)
    if (ambient.current) ambient.current.intensity = level(AMBIENT, t)
    for (const light of warm.current) {
      if (light) light.intensity = level(WARM, t)
    }
    if (cool.current) cool.current.intensity = level(COOL, t)
    state.scene.environmentIntensity = level(ENVIRONMENT, t)
  })

  return (
    <>
      <hemisphereLight ref={hemisphere}       args={['#27517f', '#05080e', 0.55]} />
            <ambientLight ref={ambient} color="#16304f" intensity={0.18} />

      {WARM_LIGHT_Z.map((z, index) => (
        <pointLight
          key={z}
          ref={(light) => {
            warm.current[index] = light
          }}
          position={[0, 10, z]}
          color="#ffc27a"
          intensity={340}
          distance={30}
          decay={2}
        />
      ))}
      <pointLight
        ref={cool}
        position={[0, 7, -58]}
        color="#2f84d6"
        intensity={260}
        distance={70}
        decay={2}
      />

      {/* Ambiente procedural: apenas painéis de luz, sem HDRI externo. */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#ffb869" position={[0, 8, -6]} rotation={[Math.PI / 2, 0, 0]} scale={[12, 2, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#ffb869" position={[0, 8, -26]} rotation={[Math.PI / 2, 0, 0]} scale={[12, 2, 1]} />
        <Lightformer form="rect" intensity={0.9} color="#2a68b0" position={[-14, 4, -10]} rotation={[0, Math.PI / 2, 0]} scale={[30, 8, 1]} />
        <Lightformer form="rect" intensity={0.9} color="#2a68b0" position={[14, 4, -10]} rotation={[0, -Math.PI / 2, 0]} scale={[30, 8, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#ff9f1c" position={[0, 3, -30]} scale={[16, 6, 1]} />
      </Environment>
    </>
  )
}

export default Lighting
