import { useEffect, useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, Color, MathUtils } from 'three'
import type { MeshBasicMaterial, MeshStandardMaterial } from 'three'
import { createRandom } from '../../../lib/random'
import { useTextures } from './assets'
import {
  AISLE_HALF_WIDTH,
  CEILING_Y,
  END_Z,
  FIRST_FRAME_Z,
  HALL_HALF_WIDTH,
  PALETTE,
} from './constants'
import { createTiledPlane } from './geometries'
import { GlowPoints } from './GlowPoints'
import type { GlowPointsData } from './GlowPoints'
import { InstanceBuilder, jitterColor } from './InstanceBuilder'
import { Instances } from './Instances'
import { frameZ, GAP_FRAME_END, GAP_FRAME_START } from './layout'
import { ModeMaterial } from './ModeMaterial'
import { FLOOR_TILE_SIZE } from './textures'

interface StructureProps {
  blend: RefObject<number>
  animated: boolean
}

export const HALL_CENTER_Z = (FIRST_FRAME_Z + 14 + END_Z) / 2
export const HALL_LENGTH = FIRST_FRAME_Z + 14 - END_Z + 20
const TRUSS_SPACING = 7
const TRUSS_COUNT = 16
const TRUSS_Y_TOP = 18.2
const TRUSS_Y_BOTTOM = 16.9
const LAMP_Y = 16.45
const LAMP_X = [-8.5, 0, 8.5] as const
const WALL_HEIGHT = 21

function trussZ(index: number) {
  return 26 - index * TRUSS_SPACING
}

function buildStructureData() {
  const random = createRandom(404)
  const chords = new InstanceBuilder()
  const diagonals = new InstanceBuilder()
  const purlins = new InstanceBuilder()
  const pilasters = new InstanceBuilder()
  const lamps = new InstanceBuilder()
  const lines = new InstanceBuilder()
  const dashes = new InstanceBuilder()

  const span = HALL_HALF_WIDTH * 2
  const panels = 20
  const panelWidth = span / panels
  const trussHeight = TRUSS_Y_TOP - TRUSS_Y_BOTTOM
  const diagonalLength = Math.hypot(panelWidth, trussHeight)
  const diagonalAngle = Math.atan2(panelWidth, trussHeight)
  const lampPositions: number[] = []

  for (let index = 0; index < TRUSS_COUNT; index += 1) {
    const z = trussZ(index)
    chords.add([0, TRUSS_Y_TOP, z], [span, 0.2, 0.2], [0, 0, 0], jitterColor(PALETTE.steel, 0.1, random))
    chords.add([0, TRUSS_Y_BOTTOM, z], [span, 0.2, 0.2], [0, 0, 0], jitterColor(PALETTE.steel, 0.1, random))

    for (let panel = 0; panel < panels; panel += 1) {
      const direction = panel % 2 === 0 ? 1 : -1
      diagonals.add(
        [-HALL_HALF_WIDTH + (panel + 0.5) * panelWidth, (TRUSS_Y_TOP + TRUSS_Y_BOTTOM) / 2, z],
        [0.1, diagonalLength, 0.1],
        [0, 0, direction * diagonalAngle],
        jitterColor(PALETTE.steel, 0.1, random),
      )
    }

    for (const x of LAMP_X) {
      lamps.add([x, LAMP_Y, z], [1.5, 0.14, 0.4])
      lampPositions.push(x, LAMP_Y - 0.15, z)
    }
  }

  for (const x of [-16, -8, 0, 8, 16]) {
    purlins.add([x, TRUSS_Y_BOTTOM + 0.35, HALL_CENTER_Z], [0.16, 0.16, HALL_LENGTH], [0, 0, 0], PALETTE.steel)
  }

  for (const side of [-1, 1]) {
    for (let z = FIRST_FRAME_Z - 4; z > END_Z; z -= 8.4) {
      pilasters.add(
        [side * (HALL_HALF_WIDTH - 0.35), 9, z],
        [0.7, 18, 0.7],
        [0, 0, 0],
        jitterColor('#ffffff', 0.05, random),
      )
    }

    for (const x of [AISLE_HALF_WIDTH - 0.45, 6.8, 10.2]) {
      lines.add([side * x, 0.012, HALL_CENTER_Z], [0.12, 0.01, HALL_LENGTH - 20])
    }
  }

  // Faixas de segurança nas bordas da travessia entre os porta-paletes.
  for (const frame of [GAP_FRAME_START, GAP_FRAME_END]) {
    lines.add([0, 0.012, frameZ(frame) + (frame === GAP_FRAME_START ? -0.9 : 0.9)], [26, 0.01, 0.14])
  }

  for (const x of [-8.5, 0, 8.5]) {
    for (let z = 24; z > END_Z + 2; z -= 4.2) {
      dashes.add([x, 0.012, z], [0.14, 0.01, 2.2])
    }
  }

  const lampCount = lampPositions.length / 3
  const glow: GlowPointsData = {
    positions: new Float32Array(lampPositions),
    colors: new Float32Array(lampCount * 3),
    sizes: new Float32Array(lampCount).fill(1.3),
    phases: new Float32Array(lampCount),
  }
  const warm = new Color('#ffcf94')
  for (let i = 0; i < lampCount; i += 1) {
    glow.colors.set([warm.r, warm.g, warm.b], i * 3)
  }

  return {
    chords: chords.build(),
    diagonals: diagonals.build(),
    purlins: purlins.build(),
    pilasters: pilasters.build(),
    lamps: lamps.build(),
    lines: lines.build(),
    dashes: dashes.build(),
    lampGlow: glow,
  }
}

function Floor({ blend }: { blend: RefObject<number> }) {
  const material = useRef<MeshStandardMaterial>(null)
  const textures = useTextures()

  const { floor, floorRoughness } = textures
  useEffect(() => {
    const repeatX = (HALL_HALF_WIDTH * 3) / FLOOR_TILE_SIZE
    const repeatY = HALL_LENGTH / FLOOR_TILE_SIZE
    floor.repeat.set(repeatX, repeatY)
    floorRoughness.repeat.set(repeatX, repeatY)
  }, [floor, floorRoughness])

  useFrame(() => {
    material.current?.color.setScalar(MathUtils.lerp(1, 0.5, blend.current))
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, HALL_CENTER_Z]}>
      <planeGeometry args={[HALL_HALF_WIDTH * 3, HALL_LENGTH]} />
      <meshStandardMaterial
        ref={material}
        map={floor}
        roughnessMap={floorRoughness}
        roughness={1}
        metalness={0.28}
        envMapIntensity={0.8}
      />
    </mesh>
  )
}

// Marcas de tráfego no corredor central: escurecem o piso sem alterar sua refletividade geral.
function TrafficMarks() {
  const { traffic } = useTextures()
  const length = HALL_LENGTH - 20

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, HALL_CENTER_Z]}>
      <planeGeometry args={[AISLE_HALF_WIDTH * 2, length]} />
      <meshStandardMaterial
        color="#000000"
        alphaMap={traffic}
        transparent
        depthWrite={false}
        roughness={0.9}
        metalness={0}
        polygonOffset
        polygonOffsetFactor={-2}
        polygonOffsetUnits={-2}
      />
    </mesh>
  )
}

function Shell() {
  const { wall } = useTextures()
  const sideGeometry = useMemo(() => createTiledPlane(HALL_LENGTH, WALL_HEIGHT, 0.31, 0.04), [])
  const backGeometry = useMemo(() => createTiledPlane(HALL_HALF_WIDTH * 2, WALL_HEIGHT, 0.31, 0.04), [])

  useEffect(
    () => () => {
      sideGeometry.dispose()
      backGeometry.dispose()
    },
    [sideGeometry, backGeometry],
  )

  return (
    <group>
      <mesh geometry={sideGeometry} rotation={[0, Math.PI / 2, 0]} position={[-HALL_HALF_WIDTH, 9.5, HALL_CENTER_Z]}>
        <meshStandardMaterial map={wall} color="#13202e" roughness={0.75} metalness={0.45} />
      </mesh>
      <mesh geometry={sideGeometry} rotation={[0, -Math.PI / 2, 0]} position={[HALL_HALF_WIDTH, 9.5, HALL_CENTER_Z]}>
        <meshStandardMaterial map={wall} color="#13202e" roughness={0.75} metalness={0.45} />
      </mesh>
      <mesh geometry={backGeometry} position={[0, 9.5, END_Z - 3]}>
        <meshStandardMaterial map={wall} color="#13202e" roughness={0.75} metalness={0.45} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, CEILING_Y, HALL_CENTER_Z]}>
        <planeGeometry args={[HALL_HALF_WIDTH * 2, HALL_LENGTH]} />
        <meshStandardMaterial color="#080f19" roughness={1} metalness={0} />
      </mesh>
    </group>
  )
}

// Foco de luz difuso no ponto de fuga, que permanece visível através da névoa.
function VanishingGlow({ blend }: { blend: RefObject<number> }) {
  const material = useRef<MeshBasicMaterial>(null)
  const { glow } = useTextures()
  const amber = useMemo(() => new Color(PALETTE.amber), [])
  const cyan = useMemo(() => new Color(PALETTE.cyan), [])

  useFrame(() => {
    const current = material.current
    if (!current) return

    current.color.lerpColors(amber, cyan, blend.current)
    current.opacity = MathUtils.lerp(0.38, 0.32, blend.current)
  })

  return (
    <mesh position={[0, 4.5, END_Z + 1]}>
      <planeGeometry args={[40, 15]} />
      <meshBasicMaterial
        ref={material}
        map={glow}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        fog={false}
        toneMapped={false}
      />
    </mesh>
  )
}

function Structure({ blend, animated }: StructureProps) {
  const textures = useTextures()
  const data = useMemo(() => buildStructureData(), [])

  return (
    <group>
      <Floor blend={blend} />
      <TrafficMarks />
      <Shell />
      <VanishingGlow blend={blend} />

      <Instances data={data.chords}>
        <ModeMaterial blend={blend} map={textures.metal} roughness={0.55} metalness={0.7} digitalOpacity={0.3} />
      </Instances>
      <Instances data={data.diagonals}>
        <ModeMaterial blend={blend} map={textures.metal} roughness={0.6} metalness={0.7} digitalOpacity={0.25} />
      </Instances>
      <Instances data={data.purlins}>
        <ModeMaterial blend={blend} map={textures.metal} roughness={0.6} metalness={0.7} digitalOpacity={0.25} />
      </Instances>
      <Instances data={data.pilasters}>
        <ModeMaterial blend={blend} color="#101d2c" roughness={0.85} metalness={0.3} digitalOpacity={0.5} />
      </Instances>

      <Instances data={data.lines}>
        <meshStandardMaterial color="#a8761c" roughness={0.55} metalness={0.1} />
      </Instances>
      <Instances data={data.dashes}>
        <meshStandardMaterial color="#6f7b89" roughness={0.6} metalness={0.1} />
      </Instances>

      <Instances data={data.lamps}>
        <meshBasicMaterial color="#ffe3bd" toneMapped={false} />
      </Instances>
      <GlowPoints
        data={data.lampGlow}
        blend={blend}
        animated={animated}
        presenceMin={1}
        fogMix={0.5}
        intensity={0.45}
      />
    </group>
  )
}

export default Structure
