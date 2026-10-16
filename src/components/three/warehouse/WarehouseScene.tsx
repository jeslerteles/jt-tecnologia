import { useEffect, useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import { PerformanceMonitor } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils } from 'three'
import { useReducedMotion } from '../../../hooks/useReducedMotion'
import { useSceneQuality } from '../../../hooks/useSceneQuality'
import { AssetsContext, createAssets, disposeAssets } from './assets'
import Automation from './Automation'
import CameraRig from './CameraRig'
import { FOG_DENSITY, PALETTE } from './constants'
import type { ViewMode } from './constants'
import DataLayer from './DataLayer'
import Lighting from './Lighting'
import Racks from './Racks'
import { blendForProgress, dimForProgress } from './scrollPath'
import Storage from './Storage'
import Structure from './Structure'

interface WarehouseSceneProps {
  /** Modo fixo (laboratório). Ignorado quando `scrollProgress` é informado. */
  mode?: ViewMode
  /** Progresso bruto da narrativa (0–1), escrito fora do React pelo ScrollTrigger. */
  scrollProgress?: RefObject<number>
}

const TRANSITION_SPEED = 2.6
const SCROLL_SMOOTHING = 4.5
const BASE_EXPOSURE = 1.1
const DIMMED_EXPOSURE = 0.6

function write(ref: RefObject<number>, value: number) {
  ref.current = value
}

interface DriverProps {
  blend: RefObject<number>
}

// Laboratório: o botão define o alvo e o blend se aproxima dele.
function ModeDriver({ blend, target, animated }: DriverProps & { target: number; animated: boolean }) {
  const invalidate = useThree((state) => state.invalidate)

  // Sem animação, a troca é imediata e a cena é redesenhada sob demanda.
  useEffect(() => {
    if (!animated) {
      write(blend, target)
      invalidate()
    }
  }, [animated, blend, target, invalidate])

  useFrame((_, delta) => {
    if (animated) {
      write(blend, MathUtils.damp(blend.current, target, TRANSITION_SPEED, delta))
    }
  }, -1)

  return null
}

// Scroll: o blend e a exposição são funções do progresso suavizado, sem estado React.
function ScrollDriver({
  blend,
  raw,
  smooth,
}: DriverProps & { raw: RefObject<number>; smooth: RefObject<number> }) {
  const started = useRef(false)

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)

    if (!started.current) {
      write(smooth, raw.current)
      started.current = true
    } else {
      write(smooth, MathUtils.damp(smooth.current, raw.current, SCROLL_SMOOTHING, delta))
    }

    write(blend, blendForProgress(smooth.current))
    state.gl.toneMappingExposure = MathUtils.lerp(
      BASE_EXPOSURE,
      DIMMED_EXPOSURE,
      dimForProgress(smooth.current),
    )
  }, -1)

  return null
}

function WarehouseScene({ mode = 'physical', scrollProgress }: WarehouseSceneProps) {
  const reducedMotion = useReducedMotion()
  const animated = !reducedMotion
  const target = mode === 'digital' ? 1 : 0
  const blend = useRef(target)
  const smoothProgress = useRef(0)
  const setDpr = useThree((state) => state.setDpr)
  const quality = useSceneQuality()
  const assets = useMemo(() => createAssets(), [])
  const maxDpr = quality === 'low' ? 1.25 : 1.5
  const scrollDriven = scrollProgress !== undefined && animated

  useEffect(() => () => disposeAssets(assets), [assets])

  return (
    <AssetsContext value={assets}>
      <color attach="background" args={[PALETTE.background]} />
      <fogExp2 attach="fog" args={[PALETTE.background, FOG_DENSITY]} />

      {scrollDriven ? (
        <ScrollDriver blend={blend} raw={scrollProgress} smooth={smoothProgress} />
      ) : (
        <ModeDriver blend={blend} target={target} animated={animated} />
      )}

      <CameraRig
        animated={animated}
        scroll={scrollDriven ? smoothProgress : undefined}
        travel={quality === 'low' ? 0.6 : 1}
      />
      <Lighting blend={blend} />
      <Structure blend={blend} animated={animated} />
      <Racks blend={blend} quality={quality} />
      <Storage blend={blend} quality={quality} />
      <Automation blend={blend} animated={animated} />
      <DataLayer blend={blend} animated={animated} />

      {animated && (
        <PerformanceMonitor
          onChange={({ factor }) => setDpr(MathUtils.clamp(0.75 + 0.75 * factor, 0.75, maxDpr))}
        />
      )}
    </AssetsContext>
  )
}

export default WarehouseScene
