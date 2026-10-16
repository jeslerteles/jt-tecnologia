import { BufferGeometry, Float32BufferAttribute, QuadraticBezierCurve3, Vector3 } from 'three'
import { createRandom } from '../../../lib/random'
import {
  AISLE_HALF_WIDTH,
  BAY_COUNT,
  END_Z,
  FIRST_FRAME_Z,
  LEVEL_HEIGHT,
  RACK_DEPTH,
  RACK_HEIGHT,
  ROW_X,
  STORAGE_LEVELS,
} from './constants'
import type { GlowPointsData } from './GlowPoints'
import { bayZ, beamY, faceSign, frameZ, GAP_FRAME_END, GAP_FRAME_START, isGapBay } from './layout'

interface PolylineOptions {
  seed: number
  speed: number
  /** 0 = ciano, 1 = laranja. */
  mix: number
  base: number
}

// Acumula polilinhas como segmentos de linha com atributos por vértice para o shader de pulsos.
class PolylineBatch {
  private readonly positions: number[] = []
  private readonly progress: number[] = []
  private readonly seed: number[] = []
  private readonly speed: number[] = []
  private readonly mix: number[] = []
  private readonly base: number[] = []

  add(points: Vector3[], options: PolylineOptions) {
    const lengths = [0]
    for (let i = 1; i < points.length; i += 1) {
      lengths.push(lengths[i - 1] + points[i].distanceTo(points[i - 1]))
    }
    const total = lengths[lengths.length - 1] || 1

    for (let i = 1; i < points.length; i += 1) {
      const a = points[i - 1]
      const b = points[i]
      this.positions.push(a.x, a.y, a.z, b.x, b.y, b.z)
      this.progress.push(lengths[i - 1] / total, lengths[i] / total)
      for (let v = 0; v < 2; v += 1) {
        this.seed.push(options.seed)
        this.speed.push(options.speed)
        this.mix.push(options.mix)
        this.base.push(options.base)
      }
    }
  }

  build() {
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new Float32BufferAttribute(this.positions, 3))
    geometry.setAttribute('aT', new Float32BufferAttribute(this.progress, 1))
    geometry.setAttribute('aSeed', new Float32BufferAttribute(this.seed, 1))
    geometry.setAttribute('aSpeed', new Float32BufferAttribute(this.speed, 1))
    geometry.setAttribute('aMix', new Float32BufferAttribute(this.mix, 1))
    geometry.setAttribute('aBase', new Float32BufferAttribute(this.base, 1))
    return geometry
  }
}

class NodeBatch {
  private readonly positions: number[] = []
  private readonly colors: number[] = []
  private readonly sizes: number[] = []
  private readonly phases: number[] = []
  private readonly random: () => number

  constructor(random: () => number) {
    this.random = random
  }

  add(position: Vector3, color: readonly [number, number, number], size: number) {
    this.positions.push(position.x, position.y, position.z)
    this.colors.push(color[0], color[1], color[2])
    this.sizes.push(size)
    this.phases.push(this.random())
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

const CYAN_RGB = [57 / 255, 188 / 255, 224 / 255] as const
const ORANGE_RGB = [1, 159 / 255, 28 / 255] as const

function arc(from: Vector3, control: Vector3, to: Vector3, steps = 28) {
  return new QuadraticBezierCurve3(from, control, to).getPoints(steps)
}

export function buildDataLayer() {
  const random = createRandom(7)
  const skeleton = new PolylineBatch()
  const traces = new PolylineBatch()
  const connections = new PolylineBatch()
  const nodes = new NodeBatch(random)
  const leds = new NodeBatch(random)

  // Contorno discreto: apenas a face de cada fileira (base, dois níveis e topo), interrompido na travessia.
  const gapStart = frameZ(GAP_FRAME_START)
  const gapEnd = frameZ(GAP_FRAME_END)
  const outlineLevels = [0, 2, 4, STORAGE_LEVELS]
  for (const rowX of ROW_X) {
    const x = rowX + faceSign(rowX) * (RACK_DEPTH / 2)

    for (const level of outlineLevels) {
      const y = level === STORAGE_LEVELS ? RACK_HEIGHT : beamY(level)
      const segments: [number, number][] = [
        [frameZ(0), gapStart],
        [gapEnd, frameZ(BAY_COUNT)],
      ]
      for (const [from, to] of segments) {
        skeleton.add([new Vector3(x, y, from), new Vector3(x, y, to)], {
          seed: random(),
          speed: 0.08 + random() * 0.1,
          mix: 0,
          base: 0.08,
        })
      }
    }
  }

  // Trilhas de dados no piso e barramentos longos ao longo dos corredores.
  const floorLines: [number, number, number][] = [
    [0, 1, 0.05],
    [-1.9, 0, 0.08],
    [1.9, 0, 0.07],
    [-8.5, 0, 0.06],
    [8.5, 1, 0.05],
  ]
  for (const [x, mix, speed] of floorLines) {
    traces.add([new Vector3(x, 0.03, FIRST_FRAME_Z + 6), new Vector3(x, 0.03, END_Z)], {
      seed: random(),
      speed,
      mix,
      base: 0.3,
    })
  }

  for (const side of [-1, 1]) {
    for (const level of [1, 3, 5]) {
      const x = side * (AISLE_HALF_WIDTH - 0.05)
      const y = level * LEVEL_HEIGHT + 1
      traces.add([new Vector3(x, y, FIRST_FRAME_Z + 2), new Vector3(x, y, END_Z)], {
        seed: random(),
        speed: 0.04 + random() * 0.05,
        mix: level === 3 ? 1 : 0,
        base: 0.22,
      })
    }
  }

  const backboneY = 15.2
  traces.add([new Vector3(0, backboneY, FIRST_FRAME_Z + 6), new Vector3(0, backboneY, END_Z)], {
    seed: 0.1,
    speed: 0.07,
    mix: 1,
    base: 0.4,
  })

  // Conexões geométricas: arcos que cruzam o corredor e sobem até o barramento central.
  for (let bay = 2; bay < BAY_COUNT; bay += 4) {
    const z = bayZ(bay)
    const orange = (bay / 4) % 2 === 1

    for (const level of [2, 4]) {
      const y = level * LEVEL_HEIGHT + 0.9
      const left = new Vector3(-(AISLE_HALF_WIDTH + 0.05), y, z)
      const right = new Vector3(AISLE_HALF_WIDTH + 0.05, y, z)
      connections.add(arc(left, new Vector3(0, y + 3.4, z), right), {
        seed: random(),
        speed: 0.22 + random() * 0.15,
        mix: orange === (level === 4) ? 1 : 0,
        base: 0.32,
      })
      nodes.add(left, CYAN_RGB, 0.55)
      nodes.add(right, CYAN_RGB, 0.55)
    }

    for (const side of [-1, 1]) {
      const top = new Vector3(side * (AISLE_HALF_WIDTH + 0.6), RACK_HEIGHT + 0.1, z)
      const hub = new Vector3(0, backboneY, z)
      connections.add(arc(top, new Vector3(side * 1.6, backboneY + 1.1, z), hub), {
        seed: random(),
        speed: 0.2 + random() * 0.12,
        mix: 0,
        base: 0.35,
      })
      nodes.add(top, ORANGE_RGB, 0.65)
    }
    nodes.add(new Vector3(0, backboneY, z), ORANGE_RGB, 1.1)
  }

  for (let bay = 6; bay < BAY_COUNT; bay += 8) {
    const z = bayZ(bay)

    for (const side of [-1, 1]) {
      const y = 8.2
      const from = new Vector3(side * 6.4, y, z)
      const to = new Vector3(side * 10.65, y, z)
      connections.add(arc(from, new Vector3(side * 8.5, y + 2.2, z), to, 20), {
        seed: random(),
        speed: 0.25,
        mix: 0,
        base: 0.3,
      })
      nodes.add(from, CYAN_RGB, 0.5)
      nodes.add(to, CYAN_RGB, 0.5)
    }
  }

  // Indicadores âmbar discretos nas travessas voltadas para os corredores.
  for (const rowX of ROW_X) {
    const face = faceSign(rowX)
    const x = rowX + face * (RACK_DEPTH / 2 + 0.07)

    for (let bay = 0; bay < BAY_COUNT; bay += 1) {
      if (isGapBay(bay)) continue
      for (let level = 0; level < STORAGE_LEVELS; level += 1) {
        if (random() > 0.1) continue

        const orange = random() < 0.35
        leds.add(
          new Vector3(x, beamY(level) + 0.02, bayZ(bay) + (random() - 0.5) * 1.6),
          orange ? ORANGE_RGB : [1, 0.74, 0.32],
          0.17,
        )
      }
    }
  }

  return {
    skeleton: skeleton.build(),
    traces: traces.build(),
    connections: connections.build(),
    nodes: nodes.build(),
    leds: leds.build(),
  }
}
