import { useState } from 'react'

export type SceneQuality = 'high' | 'low'

const LOW_QUALITY_QUERY = '(max-width: 768px), (pointer: coarse)'

// Definido uma única vez na montagem: evita reconstruir a geometria ao girar o aparelho.
export function useSceneQuality(): SceneQuality {
  const [quality] = useState<SceneQuality>(() =>
    typeof window !== 'undefined' && window.matchMedia(LOW_QUALITY_QUERY).matches
      ? 'low'
      : 'high',
  )

  return quality
}
