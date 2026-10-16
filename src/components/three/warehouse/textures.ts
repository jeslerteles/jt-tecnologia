import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three'
import type { Texture } from 'three'
import { createRandom } from '../../../lib/random'
import type { Random } from '../../../lib/random'

// Todas as texturas são desenhadas em canvas 2D: nenhum arquivo ou imagem externa.

export const FLOOR_TILE_SIZE = 5.6

interface Surface {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
}

function createSurface(width: number, height: number): Surface {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D indisponível para gerar texturas.')

  return { canvas, context }
}

interface TextureOptions {
  /** `false` para mapas de dados (roughness, alpha), que não usam sRGB. */
  color?: boolean
  repeat?: boolean
  anisotropy?: number
}

function toTexture(
  { canvas }: Surface,
  { color = true, repeat = true, anisotropy = 4 }: TextureOptions = {},
) {
  const texture = new CanvasTexture(canvas)
  if (color) texture.colorSpace = SRGBColorSpace
  if (repeat) {
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
  }
  texture.anisotropy = anisotropy
  return texture
}

function grey(value: number, alpha = 1) {
  const v = Math.round(Math.max(0, Math.min(255, value)))
  return `rgba(${v},${v},${v},${alpha})`
}

// Mancha suave desenhada também nas bordas opostas, para a textura repetir sem emendas.
function blotch(
  context: CanvasRenderingContext2D,
  size: number,
  x: number,
  y: number,
  radius: number,
  color: string,
) {
  for (let dx = -1; dx <= 1; dx += 1) {
    for (let dy = -1; dy <= 1; dy += 1) {
      const cx = x + dx * size
      const cy = y + dy * size
      if (cx + radius < 0 || cy + radius < 0 || cx - radius > size || cy - radius > size) continue

      const gradient = context.createRadialGradient(cx, cy, 0, cx, cy, radius)
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, 'rgba(0,0,0,0)')
      context.fillStyle = gradient
      context.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
    }
  }
}

function speckle(
  { context, canvas }: Surface,
  random: Random,
  count: number,
  spread: number,
  base: number,
) {
  for (let i = 0; i < count; i += 1) {
    context.fillStyle = grey(base + (random() - 0.5) * spread * 2, 0.5 + random() * 0.5)
    context.fillRect(random() * canvas.width, random() * canvas.height, 1, 1)
  }
}

function scratches(
  { context, canvas }: Surface,
  random: Random,
  count: number,
  tone: number,
  alpha: number,
) {
  context.lineWidth = 1
  for (let i = 0; i < count; i += 1) {
    const x = random() * canvas.width
    const y = random() * canvas.height
    const length = 8 + random() * canvas.width * 0.35
    const angle = (random() - 0.5) * 0.5
    context.strokeStyle = grey(tone, alpha * (0.4 + random() * 0.6))
    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
    context.stroke()
  }
}

function createMetalMap() {
  const surface = createSurface(128, 128)
  const random = createRandom(31)
  const { context } = surface

  context.fillStyle = grey(212)
  context.fillRect(0, 0, 128, 128)
  for (let i = 0; i < 14; i += 1) {
    blotch(context, 128, random() * 128, random() * 128, 30 + random() * 40, grey(random() < 0.5 ? 255 : 150, 0.12))
  }
  speckle(surface, random, 2400, 16, 212)
  scratches(surface, random, 22, 255, 0.1)
  scratches(surface, random, 14, 0, 0.12)

  return toTexture(surface)
}

function createMetalRoughness() {
  const surface = createSurface(128, 128)
  const random = createRandom(32)
  const { context } = surface

  context.fillStyle = grey(176)
  context.fillRect(0, 0, 128, 128)
  for (let i = 0; i < 16; i += 1) {
    blotch(context, 128, random() * 128, random() * 128, 24 + random() * 44, grey(random() < 0.5 ? 255 : 60, 0.2))
  }
  speckle(surface, random, 1800, 40, 176)
  scratches(surface, random, 26, 255, 0.22)

  return toTexture(surface, { color: false })
}

// Perfil de coluna com furação regular. O UV é repetido por metro na geometria.
function createUprightMap() {
  const surface = createSurface(32, 64)
  const { context } = surface

  context.fillStyle = grey(226)
  context.fillRect(0, 0, 32, 64)
  context.fillStyle = grey(255, 0.28)
  context.fillRect(0, 0, 2, 64)
  context.fillStyle = grey(0, 0.3)
  context.fillRect(30, 0, 2, 64)
  context.fillStyle = grey(26)
  context.fillRect(10, 22, 12, 22)
  context.fillStyle = grey(255, 0.22)
  context.fillRect(10, 44, 12, 1)
  context.fillStyle = grey(0, 0.5)
  context.fillRect(10, 22, 12, 2)

  return toTexture(surface, { anisotropy: 8 })
}

function createCardboardMap() {
  const surface = createSurface(128, 128)
  const random = createRandom(53)
  const { context } = surface

  context.fillStyle = grey(236)
  context.fillRect(0, 0, 128, 128)

  for (let i = 0; i < 520; i += 1) {
    const length = 6 + random() * 18
    context.fillStyle = grey(random() < 0.5 ? 20 : 255, 0.04 + random() * 0.06)
    context.fillRect(random() * 128, random() * 128, length, 1)
  }

  // Fita adesiva e etiqueta de expedição.
  context.fillStyle = grey(250, 0.9)
  context.fillRect(0, 54, 128, 18)
  context.fillStyle = grey(0, 0.12)
  context.fillRect(0, 54, 128, 1)
  context.fillRect(0, 71, 128, 1)

  context.fillStyle = grey(252)
  context.fillRect(16, 86, 54, 30)
  context.fillStyle = grey(30)
  let barX = 20
  for (let i = 0; i < 20 && barX < 66; i += 1) {
    const barWidth = 1 + Math.floor(random() * 2)
    context.fillRect(barX, 100, barWidth, 12)
    barX += barWidth + 1 + Math.floor(random() * 2)
  }
  context.fillRect(20, 90, 30, 2)
  context.fillRect(20, 94, 18, 2)

  context.strokeStyle = grey(0, 0.2)
  context.lineWidth = 3
  context.strokeRect(1.5, 1.5, 125, 125)

  return toTexture(surface)
}

// Vista lateral de um pallet: tábua superior, calços e vãos para os garfos.
function createWoodMap() {
  const surface = createSurface(128, 64)
  const random = createRandom(71)
  const { context } = surface

  context.fillStyle = grey(14)
  context.fillRect(0, 0, 128, 64)

  const board = (y: number, height: number, tone: number) => {
    context.fillStyle = grey(tone)
    context.fillRect(0, y, 128, height)
    for (let i = 0; i < 26; i += 1) {
      context.fillStyle = grey(random() < 0.5 ? 0 : 255, 0.05 + random() * 0.09)
      context.fillRect(random() * 128, y + random() * height, 10 + random() * 40, 1)
    }
  }

  board(0, 20, 232)
  board(54, 10, 206)
  context.fillStyle = grey(0, 0.35)
  context.fillRect(0, 20, 128, 3)

  for (const x of [0, 49, 98]) {
    context.fillStyle = grey(190)
    context.fillRect(x, 23, 30, 31)
    for (let i = 0; i < 10; i += 1) {
      context.fillStyle = grey(random() < 0.5 ? 0 : 255, 0.08)
      context.fillRect(x + random() * 28, 23 + random() * 30, 2, 5 + random() * 10)
    }
  }

  return toTexture(surface)
}

function createLabelMap() {
  const surface = createSurface(128, 32)
  const random = createRandom(83)
  const { context } = surface

  context.fillStyle = grey(244)
  context.fillRect(0, 0, 128, 32)
  context.fillStyle = grey(110)
  context.fillRect(0, 0, 30, 32)
  context.fillStyle = grey(240)
  context.fillRect(6, 8, 18, 4)
  context.fillRect(6, 17, 12, 4)

  context.fillStyle = grey(24)
  let x = 38
  while (x < 120) {
    const width = 1 + Math.floor(random() * 3)
    context.fillRect(x, 6, width, 20)
    x += width + 1 + Math.floor(random() * 3)
  }

  return toTexture(surface, { repeat: false })
}

function createBeltMap() {
  const surface = createSurface(64, 64)
  const random = createRandom(97)
  const { context } = surface

  context.fillStyle = grey(78)
  context.fillRect(0, 0, 64, 64)
  speckle(surface, random, 500, 14, 78)
  context.fillStyle = grey(24)
  for (let y = 0; y < 64; y += 16) {
    context.fillRect(0, y, 64, 2)
  }
  context.fillStyle = grey(0, 0.35)
  context.fillRect(0, 0, 3, 64)
  context.fillRect(61, 0, 3, 64)

  return toTexture(surface)
}

// Revestimento metálico ondulado.
function createWallMap() {
  const surface = createSurface(64, 64)
  const { context } = surface

  for (let x = 0; x < 64; x += 8) {
    const gradient = context.createLinearGradient(x, 0, x + 8, 0)
    gradient.addColorStop(0, grey(150))
    gradient.addColorStop(0.5, grey(238))
    gradient.addColorStop(1, grey(120))
    context.fillStyle = gradient
    context.fillRect(x, 0, 8, 64)
  }

  return toTexture(surface)
}

// Concreto polido: manchas de alisamento, agregado fino e juntas de dilatação.
function createFloorMaps() {
  const size = 512
  const color = createSurface(size, size)
  const rough = createSurface(size, size)
  const random = createRandom(97)

  color.context.fillStyle = '#16212d'
  color.context.fillRect(0, 0, size, size)
  rough.context.fillStyle = grey(112)
  rough.context.fillRect(0, 0, size, size)

  for (let i = 0; i < 34; i += 1) {
    const x = random() * size
    const y = random() * size
    const radius = 50 + random() * 150
    const lighter = random() < 0.5
    blotch(color.context, size, x, y, radius, lighter ? 'rgba(120,150,180,0.06)' : 'rgba(0,0,0,0.16)')
    blotch(rough.context, size, x, y, radius, lighter ? grey(210, 0.28) : grey(40, 0.34))
  }

  for (let i = 0; i < 8000; i += 1) {
    const dark = random() < 0.5
    color.context.fillStyle = dark
      ? `rgba(0,0,0,${random() * 0.25})`
      : `rgba(170,195,220,${random() * 0.07})`
    color.context.fillRect(random() * size, random() * size, 1 + random() * 1.5, 1)
  }
  speckle(rough, random, 6000, 48, 112)

  // Juntas: metade em cada borda, para fechar ao repetir.
  color.context.fillStyle = '#03070c'
  color.context.fillRect(0, 0, size, 3)
  color.context.fillRect(0, size - 3, size, 3)
  color.context.fillRect(0, 0, 3, size)
  color.context.fillRect(size - 3, 0, 3, size)
  color.context.fillStyle = 'rgba(150,180,210,0.08)'
  color.context.fillRect(0, 3, size, 1)
  color.context.fillRect(3, 0, 1, size)

  rough.context.fillStyle = grey(210)
  rough.context.fillRect(0, 0, size, 4)
  rough.context.fillRect(0, size - 4, size, 4)
  rough.context.fillRect(0, 0, 4, size)
  rough.context.fillRect(size - 4, 0, 4, size)

  return {
    floor: toTexture(color, { anisotropy: 8 }),
    floorRoughness: toTexture(rough, { color: false, anisotropy: 8 }),
  }
}

// Marcas de pneus ao longo do corredor central, aplicadas como máscara de escurecimento.
function createTrafficMap() {
  const surface = createSurface(128, 512)
  const random = createRandom(131)
  const { context } = surface

  context.fillStyle = grey(0)
  context.fillRect(0, 0, 128, 512)

  for (let i = 0; i < 46; i += 1) {
    const lane = random() < 0.5 ? 0.32 : 0.68
    const x = (lane + (random() - 0.5) * 0.2) * 128
    const width = 2 + random() * 9
    const y = random() * 512
    const length = 120 + random() * 380
    const gradient = context.createLinearGradient(0, y, 0, y + length)
    const strength = 30 + random() * 90
    gradient.addColorStop(0, grey(0))
    gradient.addColorStop(0.5, grey(strength))
    gradient.addColorStop(1, grey(0))
    context.fillStyle = gradient
    context.fillRect(x - width / 2, y, width, length)
  }

  return toTexture(surface, { color: false, repeat: false })
}

export const SIGN_LABELS = [
  { title: 'A', detail: '01 — 12' },
  { title: 'A', detail: '13 — 24' },
  { title: 'A', detail: '25 — 38' },
] as const

// Atlas vertical com uma placa por linha.
function createSignAtlas() {
  const cellHeight = 128
  const surface = createSurface(512, cellHeight * SIGN_LABELS.length)
  const { context } = surface

  SIGN_LABELS.forEach(({ title, detail }, index) => {
    const y = index * cellHeight

    context.fillStyle = '#0d1a2a'
    context.fillRect(0, y, 512, cellHeight)
    context.fillStyle = '#ff9f1c'
    context.fillRect(0, y, 512, 12)
    context.strokeStyle = 'rgba(233,237,242,0.28)'
    context.lineWidth = 3
    context.strokeRect(6, y + 6, 500, cellHeight - 12)

    context.fillStyle = '#e9edf2'
    context.font = '700 82px "Space Grotesk", "DM Sans", Arial, sans-serif'
    context.textBaseline = 'middle'
    context.fillText(title, 34, y + 72)

    context.font = '500 44px "Space Grotesk", "DM Sans", Arial, sans-serif'
    context.fillText(detail, 128, y + 74)

    context.strokeStyle = '#39bce0'
    context.lineWidth = 7
    context.lineCap = 'round'
    context.lineJoin = 'round'
    for (const offset of [0, 24]) {
      context.beginPath()
      context.moveTo(430 + offset, y + 50)
      context.lineTo(452 + offset, y + 74)
      context.lineTo(430 + offset, y + 98)
      context.stroke()
    }
  })

  return toTexture(surface, { repeat: false })
}

export function createGlowTexture() {
  const surface = createSurface(256, 256)
  const { context } = surface

  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.25, 'rgba(255,255,255,0.45)')
  gradient.addColorStop(0.6, 'rgba(255,255,255,0.1)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  context.fillStyle = gradient
  context.fillRect(0, 0, 256, 256)

  return toTexture(surface, { repeat: false })
}

export interface WarehouseTextures {
  metal: Texture
  metalRoughness: Texture
  upright: Texture
  cardboard: Texture
  wood: Texture
  label: Texture
  belt: Texture
  wall: Texture
  floor: Texture
  floorRoughness: Texture
  traffic: Texture
  signs: Texture
  glow: Texture
}

export function createTextures(): WarehouseTextures {
  return {
    metal: createMetalMap(),
    metalRoughness: createMetalRoughness(),
    upright: createUprightMap(),
    cardboard: createCardboardMap(),
    wood: createWoodMap(),
    label: createLabelMap(),
    belt: createBeltMap(),
    wall: createWallMap(),
    ...createFloorMaps(),
    traffic: createTrafficMap(),
    signs: createSignAtlas(),
    glow: createGlowTexture(),
  }
}

export function disposeTextures(textures: WarehouseTextures) {
  for (const texture of Object.values(textures)) texture.dispose()
}
