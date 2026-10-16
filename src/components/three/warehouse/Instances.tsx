import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { InstancedBufferAttribute } from 'three'
import type { BufferGeometry, InstancedMesh } from 'three'
import { useUnitBox } from './assets'
import type { InstanceData } from './InstanceBuilder'

interface InstancesProps {
  data: InstanceData
  /** Geometria própria (com UVs específicos). Por padrão usa o cubo unitário compartilhado. */
  geometry?: BufferGeometry
  children: ReactNode
}

// Escala, rotação e cor por instância sobre uma geometria compartilhada.
export function Instances({ data, geometry, children }: InstancesProps) {
  const ref = useRef<InstancedMesh>(null)
  const unitBox = useUnitBox()

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return

    mesh.instanceMatrix.array.set(data.matrices)
    mesh.instanceMatrix.needsUpdate = true
    mesh.instanceColor = new InstancedBufferAttribute(data.colors, 3)
    mesh.computeBoundingSphere()
  }, [data])

  return (
    <instancedMesh ref={ref} args={[geometry ?? unitBox, undefined, data.count]}>
      {children}
    </instancedMesh>
  )
}
