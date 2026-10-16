import { Vector3 } from 'three'

// Converte #RRGGBB em RGB (0-1) sem conversão de espaço de cor, para shaders que
// escrevem valores de exibição diretamente.
export function hexToDisplayRgb(hex: string) {
  const value = Number.parseInt(hex.replace('#', ''), 16)

  return new Vector3(
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  )
}
