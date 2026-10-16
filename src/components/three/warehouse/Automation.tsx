import { useEffect, useMemo } from 'react'
import type { RefObject } from 'react'
import { PlaneGeometry } from 'three'
import { createRandom } from '../../../lib/random'
import { useTextures } from './assets'
import { AISLE_HALF_WIDTH, PALETTE, SCANNER_FRAMES, SIGN_FRAMES } from './constants'
import { GlowPoints } from './GlowPoints'
import type { GlowPointsData } from './GlowPoints'
import { InstanceBuilder, jitterColor } from './InstanceBuilder'
import { Instances } from './Instances'
import { frameZ, GAP_Z } from './layout'
import { ModeMaterial } from './ModeMaterial'
import { SIGN_LABELS } from './textures'

interface AutomationProps {
  blend: RefObject<number>
  animated: boolean
}

const CYAN: [number, number, number] = [0.22, 0.74, 0.88]
const GREEN: [number, number, number] = [0.3, 0.9, 0.5]
const AMBER: [number, number, number] = [1, 0.62, 0.11]

class LedBatch {
  positions: number[] = []
  colors: number[] = []
  sizes: number[] = []
  phases: number[] = []

  add(x: number, y: number, z: number, color: [number, number, number], size: number, phase: number) {
    this.positions.push(x, y, z)
    this.colors.push(...color)
    this.sizes.push(size)
    this.phases.push(phase)
  }

  build(): GlowPointsData {
    return {
      positions: new Float32Array(this.positions),
      colors: new Float32Array(this.colors),
      sizes: new Float32Array(this.sizes),
      phases: new Float32Array(this.phases),
    }
  }
}

const CONVEYOR_Z = GAP_Z + 1.7
const SIDE_Z = 19
const CONVEYOR_Y = 4.25
const CONVEYOR_HALF_LENGTH = 11

function buildAutomation() {
  const random = createRandom(909)
  const steel = new InstanceBuilder()
  const dark = new InstanceBuilder()
  const belt = new InstanceBuilder()
  const parcels = new InstanceBuilder()
  const strips = new InstanceBuilder()
  const leds = new LedBatch()

  for (const frame of SCANNER_FRAMES) {
    const z = frameZ(frame)
    const postX = AISLE_HALF_WIDTH - 0.3

    for (const side of [-1, 1]) {
      steel.add([side * postX, 2.7, z], [0.22, 5.4, 0.22], [0, 0, 0], PALETTE.graphite)
      dark.add([side * postX, 0.08, z], [0.6, 0.16, 0.6], [0, 0, 0], '#1a2128')
      dark.add([side * (postX - 0.18), 3.4, z], [0.18, 0.5, 0.16], [0, 0, 0], '#10161c')
      leds.add(side * (postX - 0.18), 3.45, z + 0.1, side > 0 ? GREEN : AMBER, 1, random())
    }

    steel.add([0, 5.05, z], [postX * 2 + 0.3, 0.34, 0.3], [0, 0, 0], PALETTE.steel)
    dark.add([0, 4.82, z], [postX * 2, 0.1, 0.22], [0, 0, 0], '#0d1319')
    // Tira de leitura sob a viga.
    strips.add([0, 4.74, z], [postX * 1.9, 0.04, 0.06])

    for (let i = -3; i <= 3; i += 1) {
      leds.add(i * 1.0, 4.72, z, CYAN, 0.7, random())
    }
  }

  // Esteira aérea que atravessa o corredor na travessia.
  steel.add([0, CONVEYOR_Y - 0.22, CONVEYOR_Z], [CONVEYOR_HALF_LENGTH * 2, 0.16, 0.9], [0, 0, 0], PALETTE.steel)
  belt.add([0, CONVEYOR_Y, CONVEYOR_Z], [CONVEYOR_HALF_LENGTH * 2, 0.08, 0.7], [0, 0, 0], '#ffffff')
  for (const side of [-1, 1]) {
    steel.add([0, CONVEYOR_Y + 0.08, CONVEYOR_Z + side * 0.42], [CONVEYOR_HALF_LENGTH * 2, 0.12, 0.05], [0, 0, 0], PALETTE.steel)
  }
  for (let x = -CONVEYOR_HALF_LENGTH + 1; x <= CONVEYOR_HALF_LENGTH; x += 3.6) {
    dark.add([x, CONVEYOR_Y - 0.1, CONVEYOR_Z], [0.1, 0.1, 0.9], [0, 0, 0], '#161d24')
    for (const side of [-1, 1]) {
      steel.add([x, 8.8, CONVEYOR_Z + side * 0.3], [0.04, 8.9, 0.04], [0, 0, 0], PALETTE.steel)
    }
  }

  for (let x = -9; x <= 9; x += 1.8 + random() * 1.6) {
    const w = 0.5 + random() * 0.4
    const h = 0.28 + random() * 0.22
    parcels.add(
      [x, CONVEYOR_Y + 0.04 + h / 2, CONVEYOR_Z + (random() - 0.5) * 0.12],
      [w, h, 0.4 + random() * 0.15],
      [0, (random() - 0.5) * 0.1, 0],
      jitterColor('#9a8566', 0.1, random),
    )
  }

  // Sensores fotoelétricos ao longo da esteira.
  for (const x of [-3.2, 3.2]) {
    dark.add([x, CONVEYOR_Y + 0.35, CONVEYOR_Z + 0.5], [0.12, 0.12, 0.12], [0, 0, 0], '#0d1319')
    leds.add(x, CONVEYOR_Y + 0.35, CONVEYOR_Z + 0.58, AMBER, 0.8, random())
  }

  // Esteiras laterais curtas e gabinetes de controle junto às frentes dos racks.
  for (const side of [-1, 1]) {
    const x = side * 8.5
    belt.add([x, 0.62, SIDE_Z], [0.8, 0.08, 9], [0, 0, 0], '#ffffff')
    for (const dz of [-4, -2, 0, 2, 4]) {
      for (const lx of [-0.45, 0.45]) {
        steel.add([x + lx, 0.3, SIDE_Z + dz], [0.08, 0.6, 0.08], [0, 0, 0], PALETTE.steel)
      }
    }
    for (const lx of [-0.5, 0.5]) {
      steel.add([x + lx, 0.74, SIDE_Z], [0.06, 0.12, 9], [0, 0, 0], PALETTE.steel)
    }
    dark.add([side * 6.8, 0.8, SIDE_Z + 5.6], [0.7, 1.6, 0.5], [0, 0, 0], '#141b22')
    leds.add(side * 6.8, 1.5, SIDE_Z + 5.9, GREEN, 0.9, random())
    leds.add(side * 6.8, 1.3, SIDE_Z + 5.9, AMBER, 0.9, random())
  }

  return {
    steel: steel.build(),
    dark: dark.build(),
    belt: belt.build(),
    parcels: parcels.build(),
    strips: strips.build(),
    leds: leds.build(),
  }
}

function Signs() {
  const { signs } = useTextures()
  const geometries = useMemo(
    () =>
      SIGN_LABELS.map((_, index) => {
        const geometry = new PlaneGeometry(3.4, 1.1)
        const uv = geometry.attributes.uv
        const count = SIGN_LABELS.length
        for (let i = 0; i < uv.count; i += 1) {
          uv.setY(i, (uv.getY(i) + (count - 1 - index)) / count)
        }
        return geometry
      }),
    [],
  )

  useEffect(
    () => () => {
      for (const geometry of geometries) geometry.dispose()
    },
    [geometries],
  )

  return (
    <group>
      {SIGN_FRAMES.map((frame, index) => {
        const z = frameZ(frame)
        const geometry = geometries[index % geometries.length]
        return (
          <group key={frame} position={[0, 9.6, z]}>
            {[-0.9, 0.9].map((x) => (
              <mesh key={x} position={[x, 3.9, 0]}>
                <boxGeometry args={[0.03, 7.8, 0.03]} />
                <meshStandardMaterial color={PALETTE.steel} roughness={0.5} metalness={0.8} />
              </mesh>
            ))}
            {[0, Math.PI].map((rotation) => (
              <mesh key={rotation} geometry={geometry} rotation={[0, rotation, 0]} position={[0, 0, rotation === 0 ? 0.03 : -0.03]}>
                <meshStandardMaterial
                  map={signs}
                  emissiveMap={signs}
                  emissive="#ffffff"
                  emissiveIntensity={0.55}
                  roughness={0.6}
                />
              </mesh>
            ))}
          </group>
        )
      })}
    </group>
  )
}

function Automation({ blend, animated }: AutomationProps) {
  const textures = useTextures()
  const data = useMemo(() => buildAutomation(), [])

  return (
    <group>
      <Instances data={data.steel}>
        <ModeMaterial blend={blend} map={textures.metal} roughness={0.5} metalness={0.75} digitalOpacity={0.4} />
      </Instances>
      <Instances data={data.dark}>
        <ModeMaterial blend={blend} roughness={0.55} metalness={0.5} digitalOpacity={0.4} />
      </Instances>
      <Instances data={data.belt}>
        <ModeMaterial blend={blend} map={textures.belt} roughness={0.8} metalness={0.1} digitalOpacity={0.35} />
      </Instances>
      <Instances data={data.parcels}>
        <ModeMaterial blend={blend} map={textures.cardboard} roughness={0.85} metalness={0.02} digitalOpacity={0.2} />
      </Instances>
      <Instances data={data.strips}>
        <meshBasicMaterial color="#39bce0" toneMapped={false} />
      </Instances>
      <Signs />
      <GlowPoints data={data.leds} blend={blend} animated={animated} presenceMin={1} pulse={0.5} fogMix={0.8} intensity={0.9} />
    </group>
  )
}

export default Automation
