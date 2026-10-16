export type ViewMode = 'physical' | 'digital'

export const PALETTE = {
  background: '#050A10',
  surface: '#0B1928',
  graphite: '#222A32',
  steel: '#48535F',
  amber: '#FF9F1C',
  cyan: '#39BCE0',
  text: '#E9EDF2',
} as const

// Unidades em metros. O corredor central corre ao longo de Z, de +Z (câmera) a -Z (fundo).
export const AISLE_HALF_WIDTH = 4
export const BAY_LENGTH = 2.8
export const BAY_COUNT = 40
export const FIRST_FRAME_Z = 28
export const END_Z = FIRST_FRAME_Z - BAY_COUNT * BAY_LENGTH

export const STORAGE_LEVELS = 6
export const LEVEL_HEIGHT = 2.1
export const BEAM_BASE_Y = 0.18
export const RACK_HEIGHT = STORAGE_LEVELS * LEVEL_HEIGHT + 0.4
export const RACK_DEPTH = 1.1

// Quatro fileiras por lado: duas costas com costas junto ao corredor central e duas
// voltadas para o corredor secundário.
export const ROW_X = [-12.4, -11.2, -5.8, -4.6, 4.6, 5.8, 11.2, 12.4] as const

// Travessia: sem porta-paletes entre os quadros GAP_FRAME - 1 e GAP_FRAME + 1.
export const GAP_FRAME = 7
export const GAP_BAYS = [6, 7] as const
export const SCANNER_FRAMES = [7, 21] as const
export const SIGN_FRAMES = [10, 19, 28] as const

export const HALL_HALF_WIDTH = 22
export const CEILING_Y = 19
export const FOG_DENSITY = 0.017

export const CAMERA_POSITION = [0, 2.6, 26] as const
export const CAMERA_TARGET = [0, 5.4, -45] as const
