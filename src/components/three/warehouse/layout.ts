import {
  BAY_LENGTH,
  BEAM_BASE_Y,
  FIRST_FRAME_Z,
  GAP_BAYS,
  GAP_FRAME,
  LEVEL_HEIGHT,
} from './constants'

export function frameZ(index: number) {
  return FIRST_FRAME_Z - index * BAY_LENGTH
}

export function bayZ(index: number) {
  return FIRST_FRAME_Z - (index + 0.5) * BAY_LENGTH
}

export const GAP_Z = frameZ(GAP_FRAME)

// Quadros que fecham os dois lados da travessia.
export const GAP_FRAME_START = GAP_FRAME - 1
export const GAP_FRAME_END = GAP_FRAME + 1

export function isGapBay(index: number) {
  return (GAP_BAYS as readonly number[]).includes(index)
}

export function isGapFrame(index: number) {
  return index === GAP_FRAME
}

export function beamY(level: number) {
  return level * LEVEL_HEIGHT + BEAM_BASE_Y
}

// Sentido (-1 ou +1, em X) para onde a face de carga da fileira aponta.
export function faceSign(rowX: number) {
  const inward = Math.abs(rowX) === 4.6 || Math.abs(rowX) === 11.2

  return inward ? -Math.sign(rowX) : Math.sign(rowX)
}
