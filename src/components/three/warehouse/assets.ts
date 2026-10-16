import { createContext, useContext } from 'react'
import { BoxGeometry } from 'three'
import { createTextures, disposeTextures } from './textures'
import type { WarehouseTextures } from './textures'

// Recursos compartilhados por toda a cena: criados uma vez e descartados juntos.
export interface SceneAssets {
  textures: WarehouseTextures
  unitBox: BoxGeometry
}

export function createAssets(): SceneAssets {
  return { textures: createTextures(), unitBox: new BoxGeometry(1, 1, 1) }
}

export function disposeAssets(assets: SceneAssets) {
  disposeTextures(assets.textures)
  assets.unitBox.dispose()
}

export const AssetsContext = createContext<SceneAssets | null>(null)

function useAssets() {
  const assets = useContext(AssetsContext)
  if (!assets) throw new Error('Recursos da cena indisponíveis fora de WarehouseScene.')

  return assets
}

export function useTextures() {
  return useAssets().textures
}

export function useUnitBox() {
  return useAssets().unitBox
}
