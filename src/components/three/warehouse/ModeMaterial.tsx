import { useRef } from 'react'
import type { RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import type { ThreeElements } from '@react-three/fiber'
import { MathUtils } from 'three'
import type { ColorRepresentation, MeshStandardMaterial } from 'three'

type StandardMaterialProps = Omit<ThreeElements['meshStandardMaterial'], 'ref'>

interface ModeMaterialProps extends StandardMaterialProps {
  blend: RefObject<number>
  /** Opacidade no modo Digital (0 = invisível). No modo Physical é sempre 1. */
  digitalOpacity: number
  digitalEmissive?: ColorRepresentation
  digitalEmissiveIntensity?: number
}

// Material PBR que se dissolve gradualmente conforme `blend` (0 = Physical, 1 = Digital).
// Permanece `transparent` para evitar recompilar o programa durante a transição.
export function ModeMaterial({
  blend,
  digitalOpacity,
  digitalEmissive = '#000000',
  digitalEmissiveIntensity = 0,
  ...props
}: ModeMaterialProps) {
  const ref = useRef<MeshStandardMaterial>(null)

  useFrame(() => {
    const material = ref.current
    if (!material) return

    const t = blend.current
    material.opacity = MathUtils.lerp(1, digitalOpacity, t)
    material.emissiveIntensity = t * digitalEmissiveIntensity
    material.depthWrite = t < 0.02
  })

  return (
    <meshStandardMaterial
      ref={ref}
      transparent
      emissive={digitalEmissive}
      emissiveIntensity={0}
      {...props}
    />
  )
}
