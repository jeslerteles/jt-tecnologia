import { useEffect, useMemo } from 'react'
import type { RefObject } from 'react'
import { createRandom } from '../../../lib/random'
import type { SceneQuality } from '../../../hooks/useSceneQuality'
import { useTextures } from './assets'
import {
  BAY_COUNT,
  BAY_LENGTH,
  LEVEL_HEIGHT,
  PALETTE,
  RACK_DEPTH,
  RACK_HEIGHT,
  ROW_X,
  STORAGE_LEVELS,
} from './constants'
import { createTiledBox } from './geometries'
import { InstanceBuilder, jitterColor } from './InstanceBuilder'
import { Instances } from './Instances'
import { bayZ, beamY, faceSign, frameZ, GAP_FRAME_END, GAP_FRAME_START, isGapBay, isGapFrame } from './layout'
import { ModeMaterial } from './ModeMaterial'

interface RacksProps {
  blend: RefObject<number>
  quality: SceneQuality
}

const ORANGE = '#e8890f'
const DIM_AMBER = '#8a6420'

function buildRackData(quality: SceneQuality) {
  const random = createRandom(11)
  const nearFrames = quality === 'high' ? 16 : 9
  const uprights = new InstanceBuilder()
  const plates = new InstanceBuilder()
  const braces = new InstanceBuilder()
  const beams = new InstanceBuilder()
  const clips = new InstanceBuilder()
  const guards = new InstanceBuilder()
  const protectors = new InstanceBuilder()
  const labels = new InstanceBuilder()

  const bracePitch = Math.atan2(RACK_DEPTH, LEVEL_HEIGHT)
  const braceLength = Math.hypot(RACK_DEPTH, LEVEL_HEIGHT)

  for (const rowX of ROW_X) {
    const face = faceSign(rowX)
    const mainAisle = Math.abs(rowX) === 4.6

    for (let frame = 0; frame <= BAY_COUNT; frame += 1) {
      if (isGapFrame(frame)) continue

      const z = frameZ(frame)
      const near = frame <= nearFrames

      for (const side of [-1, 1]) {
        const x = rowX + side * (RACK_DEPTH / 2)
        uprights.add([x, RACK_HEIGHT / 2, z], [1, 1, 1], [0, 0, 0], jitterColor(PALETTE.graphite, 0.05, random))
        plates.add([x, 0.01, z], [0.26, 0.02, 0.26], [0, 0, 0], jitterColor(PALETTE.steel, 0.08, random))

        if (side === face) {
          guards.add(
            [x + face * 0.012, 0.25, z],
            [0.17, 0.5, 0.17],
            [0, 0, 0],
            jitterColor(mainAisle ? ORANGE : DIM_AMBER, 0.06, random),
          )

          if (near) {
            for (let level = 0; level <= STORAGE_LEVELS; level += 1) {
              clips.add(
                [x + face * 0.065, beamY(level), z],
                [0.03, 0.22, 0.12],
                [0, 0, 0],
                jitterColor('#6d7885', 0.1, random),
              )
            }
          }
        }
      }

      for (let segment = 0; segment < STORAGE_LEVELS; segment += 1) {
        if (!near && segment % 2 === 1) continue

        const direction = (frame + segment) % 2 === 0 ? 1 : -1
        braces.add(
          [rowX, segment * LEVEL_HEIGHT + 0.3 + LEVEL_HEIGHT / 2, z],
          [0.045, braceLength, 0.045],
          [0, 0, direction * bracePitch],
          jitterColor(PALETTE.steel, 0.08, random),
        )
      }
    }

    for (let bay = 0; bay < BAY_COUNT; bay += 1) {
      if (isGapBay(bay)) continue

      for (let level = 0; level <= STORAGE_LEVELS; level += 1) {
        beams.add(
          [rowX + face * (RACK_DEPTH / 2), beamY(level), bayZ(bay)],
          [0.07, 0.14, BAY_LENGTH - 0.12],
          [0, 0, 0],
          jitterColor(level === 0 ? ORANGE : PALETTE.steel, 0.1, random),
        )

        if (level < STORAGE_LEVELS && (bay <= nearFrames || bay % 2 === 0)) {
          labels.add(
            [rowX + face * (RACK_DEPTH / 2 + 0.045), beamY(level) + 0.01, bayZ(bay)],
            [0.012, 0.075, 0.44],
            [0, 0, 0],
            random() < 0.18 ? '#f2c36b' : '#dfe5ec',
          )
        }
      }
    }

    // Protetores de ponta de fileira diante dos quadros que terminam em corredor transversal.
    const ends = [
      { frame: 0, direction: 1 },
      { frame: GAP_FRAME_START, direction: -1 },
      { frame: GAP_FRAME_END, direction: 1 },
    ]
    for (const { frame, direction } of ends) {
      for (const side of [-1, 1]) {
        protectors.add(
          [rowX + side * (RACK_DEPTH / 2 - 0.1), 0.42, frameZ(frame) + direction * 0.42],
          [0.13, 0.84, 0.13],
          [0, 0, 0],
          jitterColor(ORANGE, 0.06, random),
        )
      }
    }
  }

  return {
    uprights: uprights.build(),
    plates: plates.build(),
    braces: braces.build(),
    beams: beams.build(),
    clips: clips.build(),
    guards: guards.build(),
    protectors: protectors.build(),
    labels: labels.build(),
  }
}

function Racks({ blend, quality }: RacksProps) {
  const textures = useTextures()
  const data = useMemo(() => buildRackData(quality), [quality])
  const uprightGeometry = useMemo(() => createTiledBox(0.1, RACK_HEIGHT, 0.1, 13), [])

  useEffect(() => () => uprightGeometry.dispose(), [uprightGeometry])

  return (
    <group>
      <Instances data={data.uprights} geometry={uprightGeometry}>
        <ModeMaterial
          blend={blend}
          map={textures.upright}
          roughnessMap={textures.metalRoughness}
          roughness={0.62}
          metalness={0.72}
          digitalOpacity={0.4}
          digitalEmissive={PALETTE.cyan}
          digitalEmissiveIntensity={0.22}
        />
      </Instances>
      <Instances data={data.plates}>
        <ModeMaterial blend={blend} map={textures.metal} roughness={0.6} metalness={0.7} digitalOpacity={0.2} />
      </Instances>
      <Instances data={data.braces}>
        <ModeMaterial
          blend={blend}
          map={textures.metal}
          roughnessMap={textures.metalRoughness}
          roughness={0.65}
          metalness={0.65}
          digitalOpacity={0.12}
        />
      </Instances>
      <Instances data={data.beams}>
        <ModeMaterial
          blend={blend}
          map={textures.metal}
          roughnessMap={textures.metalRoughness}
          roughness={0.5}
          metalness={0.62}
          digitalOpacity={0.45}
          digitalEmissive={PALETTE.cyan}
          digitalEmissiveIntensity={0.16}
        />
      </Instances>
      <Instances data={data.clips}>
        <ModeMaterial blend={blend} roughness={0.4} metalness={0.8} digitalOpacity={0.25} />
      </Instances>
      <Instances data={data.guards}>
        <ModeMaterial blend={blend} map={textures.metal} roughness={0.6} metalness={0.25} digitalOpacity={0.45} />
      </Instances>
      <Instances data={data.protectors}>
        <ModeMaterial blend={blend} map={textures.metal} roughness={0.55} metalness={0.25} digitalOpacity={0.4} />
      </Instances>
      <Instances data={data.labels}>
        <ModeMaterial blend={blend} map={textures.label} roughness={0.7} metalness={0.05} digitalOpacity={0.3} />
      </Instances>
    </group>
  )
}

export default Racks
