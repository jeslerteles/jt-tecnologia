// Trajetória determinística da câmera na experiência de scroll.
// Tudo é função pura do progresso normalizado (0–1): nada é acumulado por frame.

export const SCROLL_ACT_BOUNDS = [0, 0.25, 0.5, 0.75, 1] as const

// Velocidade relativa em cada limite de ato: parte devagar, acelera no ato II,
// desacelera no III e fecha com um movimento discreto no IV.
const SPEED_KNOTS = [0.35, 0.95, 1, 0.5, 0.18] as const
const SAMPLES = 256

const DEPTH_TABLE = (() => {
  const speedAt = (p: number) => {
    const scaled = Math.min(p, 0.9999) * (SPEED_KNOTS.length - 1)
    const index = Math.floor(scaled)
    const local = scaled - index
    return SPEED_KNOTS[index] * (1 - local) + SPEED_KNOTS[index + 1] * local
  }

  const table = new Float32Array(SAMPLES + 1)
  for (let i = 1; i <= SAMPLES; i += 1) {
    table[i] = table[i - 1] + speedAt((i - 0.5) / SAMPLES)
  }
  const total = table[SAMPLES]
  for (let i = 0; i <= SAMPLES; i += 1) table[i] /= total

  return table
})()

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp01((value - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

/** Fração (0–1) do percurso total já percorrida no progresso `p`. */
export function travelFraction(p: number) {
  const scaled = clamp01(p) * SAMPLES
  const index = Math.min(Math.floor(scaled), SAMPLES - 1)
  const local = scaled - index
  return DEPTH_TABLE[index] * (1 - local) + DEPTH_TABLE[index + 1] * local
}

/** Physical (0) → Digital (1): começa no ato II e se completa no ato III. */
export function blendForProgress(p: number) {
  return smoothstep(0.24, 0.72, p)
}

/** 0 → 1 durante o ato IV, usado para escurecer a cena sem apagá-la. */
export function dimForProgress(p: number) {
  return smoothstep(0.76, 1, p)
}
