import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, PerspectiveCamera, Vector3 } from 'three'
import { CAMERA_POSITION, CAMERA_TARGET } from './constants'
import { travelFraction } from './scrollPath'

interface CameraRigProps {
  animated: boolean
  /** Progresso suavizado (0–1) quando a câmera é controlada pelo scroll. */
  scroll?: RefObject<number>
  /** Escala do percurso no modo scroll (menor em telas pequenas). */
  travel?: number
}

// Deslocamentos máximos (metros) em resposta ao mouse; mantidos pequenos de propósito.
const MAX_OFFSET_X = 0.6
const MAX_OFFSET_Y = 0.25
const POINTER_DAMPING = 3.2
const OFFSET_DAMPING = 2.4

// Aproximação inicial: a câmera parte um pouco atrás e mais baixa, e só ocorre uma vez.
const INTRO_DURATION = 3.4
const INTRO_BACK = 4.5
const INTRO_DROP = 0.5

// Percurso do scroll: do início do corredor até pouco depois do primeiro pórtico.
const SCROLL_DEPTH = 46
const SCROLL_RISE = 0.3
const LOOK_AHEAD = CAMERA_POSITION[2] - CAMERA_TARGET[2]
const LOOK_RISE = CAMERA_TARGET[1] - CAMERA_POSITION[1]
const SCROLL_PARALLAX = 0.5

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

function CameraRig({ animated, scroll, travel = 1 }: CameraRigProps) {
  const get = useThree((state) => state.get)
  const width = useThree((state) => state.size.width)
  const height = useThree((state) => state.size.height)
  const invalidate = useThree((state) => state.invalidate)
  const smoothPointer = useRef({ x: 0, y: 0 })
  const offset = useRef({ x: 0, y: 0 })
  const introTime = useRef(0)
  const lookAt = useRef(new Vector3())

  useEffect(() => {
    const camera = get().camera
    if (!(camera instanceof PerspectiveCamera)) return

    camera.fov = width / height < 1 ? 62 : 46
    camera.updateProjectionMatrix()
  }, [get, width, height])

  // Posição estática (sem intro nem paralaxe) para movimento reduzido.
  useEffect(() => {
    if (animated) return

    const camera = get().camera
    camera.position.set(...CAMERA_POSITION)
    camera.lookAt(...CAMERA_TARGET)
    invalidate()
  }, [animated, get, invalidate])

  useFrame(({ camera, pointer }, rawDelta) => {
    if (!animated) return

    // Limita o delta para que travamentos não "pulem" a introdução.
    const delta = Math.min(rawDelta, 0.05)

    const smooth = smoothPointer.current
    smooth.x = MathUtils.damp(smooth.x, pointer.x, POINTER_DAMPING, delta)
    smooth.y = MathUtils.damp(smooth.y, pointer.y, POINTER_DAMPING, delta)

    const current = offset.current

    if (scroll) {
      // Posição derivada do progresso; alvo transladado com a câmera mantém o ponto de fuga.
      const fraction = travelFraction(scroll.current)
      const parallax = SCROLL_PARALLAX * travel
      current.x = MathUtils.damp(current.x, smooth.x * MAX_OFFSET_X * parallax, OFFSET_DAMPING, delta)
      current.y = MathUtils.damp(current.y, smooth.y * MAX_OFFSET_Y * parallax, OFFSET_DAMPING, delta)

      const z = CAMERA_POSITION[2] - fraction * SCROLL_DEPTH * travel
      const y = CAMERA_POSITION[1] + fraction * SCROLL_RISE * travel + current.y

      camera.position.set(CAMERA_POSITION[0] + current.x, y, z)
      lookAt.current.set(CAMERA_TARGET[0] + current.x, y + LOOK_RISE, z - LOOK_AHEAD)
      camera.lookAt(lookAt.current)
      return
    }

    introTime.current = Math.min(introTime.current + delta, INTRO_DURATION)
    const intro = 1 - easeOutCubic(introTime.current / INTRO_DURATION)

    current.x = MathUtils.damp(current.x, smooth.x * MAX_OFFSET_X, OFFSET_DAMPING, delta)
    current.y = MathUtils.damp(current.y, smooth.y * MAX_OFFSET_Y, OFFSET_DAMPING, delta)

    camera.position.set(
      CAMERA_POSITION[0] + current.x,
      CAMERA_POSITION[1] + current.y - intro * INTRO_DROP,
      CAMERA_POSITION[2] + intro * INTRO_BACK,
    )
    // Alvo transladado junto com a câmera: o ponto de fuga permanece estável.
    lookAt.current.set(
      CAMERA_TARGET[0] + current.x,
      CAMERA_TARGET[1] + current.y,
      CAMERA_TARGET[2],
    )
    camera.lookAt(lookAt.current)
  })

  return null
}

export default CameraRig
