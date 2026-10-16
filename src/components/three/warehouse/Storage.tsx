import { useMemo } from 'react'
import type { RefObject } from 'react'
import { createRandom } from '../../../lib/random'
import type { Random } from '../../../lib/random'
import type { SceneQuality } from '../../../hooks/useSceneQuality'
import { useTextures } from './assets'
import { BAY_COUNT, ROW_X, STORAGE_LEVELS } from './constants'
import { InstanceBuilder, jitterColor } from './InstanceBuilder'
import { Instances } from './Instances'
import { bayZ, beamY, isGapBay } from './layout'
import { ModeMaterial } from './ModeMaterial'

interface StorageProps {
  blend: RefObject<number>
  quality: SceneQuality
}

const PALLET_SLOT_OFFSETS = [-0.68, 0.68] as const
const CARDBOARD = ['#9a8566', '#8e7b5e', '#a38e6e', '#867558', '#94805f']
const TOTES = ['#2b3a4b', '#33465a', '#283340']
const LIGHT_CARTON = '#b9bec4'
const ACCENT_CARTON = '#c9801c'
const WRAP = ['#566678', '#4a5a6b', '#607284']
const WOOD = '#8b6b47'

function pick<T>(items: readonly T[], random: Random) {
  return items[Math.floor(random() * items.length)]
}

function cartonColor(random: Random) {
  const roll = random()
  if (roll < 0.035) return jitterColor(ACCENT_CARTON, 0.06, random)
  if (roll < 0.1) return jitterColor(LIGHT_CARTON, 0.06, random)
  if (roll < 0.27) return jitterColor(pick(TOTES, random), 0.06, random)
  return jitterColor(pick(CARDBOARD, random), 0.08, random)
}

function buildStorageData(quality: SceneQuality) {
  const random = createRandom(2026)
  const detailBays = quality === 'high' ? 22 : 10
  const pallets = new InstanceBuilder()
  const wraps = new InstanceBuilder()
  const cartons = new InstanceBuilder()

  for (const rowX of ROW_X) {
    for (let bay = 0; bay < BAY_COUNT; bay += 1) {
      if (isGapBay(bay)) continue

      const detailed = bay < detailBays

      for (let level = 0; level < STORAGE_LEVELS; level += 1) {
        for (const slotOffset of PALLET_SLOT_OFFSETS) {
          // Níveis mais altos e fileiras mais ao fundo ficam um pouco mais vazios.
          const emptyChance = 0.07 + level * 0.025 + (bay / BAY_COUNT) * 0.06
          if (random() < emptyChance) continue

          const x = rowX + (random() - 0.5) * 0.07
          const z = bayZ(bay) + slotOffset + (random() - 0.5) * 0.08
          const yaw = (random() - 0.5) * 0.06
          const deckY = beamY(level) + 0.07 + 0.075

          pallets.add([x, deckY, z], [1.0, 0.15, 1.2], [0, yaw, 0], jitterColor(WOOD, 0.14, random))

          const loadBase = deckY + 0.075

          if (random() < 0.3) {
            const height = 0.9 + random() * 0.7
            wraps.add(
              [x, loadBase + height / 2, z],
              [0.94 + random() * 0.05, height, 1.1 + random() * 0.04],
              [0, yaw, 0],
              jitterColor(pick(WRAP, random), 0.07, random),
            )
            continue
          }

          const columns = random() < 0.5 ? 2 : 3
          const depth = 1.2 / columns - 0.04
          const layers = 1 + (random() < 0.55 ? 1 : 0)
          let layerBase = loadBase

          for (let layer = 0; layer < layers; layer += 1) {
            const layerHeight = 0.38 + random() * 0.22

            if (!detailed) {
              // Longe da câmera, cada camada vira um único volume.
              cartons.add(
                [x, layerBase + layerHeight / 2, z],
                [0.98, layerHeight, 1.14],
                [0, yaw, 0],
                cartonColor(random),
              )
              layerBase += layerHeight
              continue
            }

            for (let ix = 0; ix < 2; ix += 1) {
              for (let iz = 0; iz < columns; iz += 1) {
                if (layer > 0 && random() < 0.15) continue

                const height = layerHeight + (random() - 0.5) * 0.05
                const localX = (ix - 0.5) * 0.5
                const localZ = (iz - (columns - 1) / 2) * (depth + 0.04)

                cartons.add(
                  [
                    x + localX + (random() - 0.5) * 0.02,
                    layerBase + height / 2,
                    z + localZ + (random() - 0.5) * 0.02,
                  ],
                  [0.46 + (random() - 0.5) * 0.03, height, depth],
                  [0, yaw + (random() - 0.5) * 0.04, 0],
                  cartonColor(random),
                )
              }
            }

            layerBase += layerHeight
          }
        }
      }
    }
  }

  return {
    pallets: pallets.build(),
    wraps: wraps.build(),
    cartons: cartons.build(),
  }
}

function Storage({ blend, quality }: StorageProps) {
  const textures = useTextures()
  const data = useMemo(() => buildStorageData(quality), [quality])

  return (
    <group>
      <Instances data={data.pallets}>
        <ModeMaterial blend={blend} map={textures.wood} roughness={0.88} metalness={0.02} digitalOpacity={0.08} />
      </Instances>
      <Instances data={data.wraps}>
        <ModeMaterial blend={blend} roughness={0.28} metalness={0.2} digitalOpacity={0.1} />
      </Instances>
      <Instances data={data.cartons}>
        <ModeMaterial blend={blend} map={textures.cardboard} roughness={0.84} metalness={0.02} digitalOpacity={0.07} />
      </Instances>
    </group>
  )
}

export default Storage
