import { BoxGeometry, PlaneGeometry } from 'three'

// Plano com UVs repetidos por metro em cada eixo.
export function createTiledPlane(
  width: number,
  height: number,
  repeatU: number,
  repeatV: number,
) {
  const geometry = new PlaneGeometry(width, height)
  const uv = geometry.attributes.uv

  for (let i = 0; i < uv.count; i += 1) {
    uv.setXY(i, uv.getX(i) * width * repeatU, uv.getY(i) * height * repeatV)
  }

  return geometry
}

// Caixa com dimensões reais e UVs repetidos por metro, para texturas de escala constante
// (por exemplo, as perfurações de uma coluna de 13 m).
export function createTiledBox(
  width: number,
  height: number,
  depth: number,
  repeatPerMeter: number,
) {
  const geometry = new BoxGeometry(width, height, depth)
  const uv = geometry.attributes.uv
  const normal = geometry.attributes.normal

  for (let i = 0; i < uv.count; i += 1) {
    const nx = Math.abs(normal.getX(i))
    const ny = Math.abs(normal.getY(i))
    const spanU = nx > 0.5 ? depth : width
    const spanV = ny > 0.5 ? depth : height

    uv.setXY(i, uv.getX(i) * Math.max(1, Math.round(spanU * repeatPerMeter)), uv.getY(i) * Math.max(1, Math.round(spanV * repeatPerMeter)))
  }

  return geometry
}
