import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { FocusEvent, RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { HERO_ACTS } from '../lib/content'
import type { HeroAct } from '../lib/content'

gsap.registerPlugin(ScrollTrigger)

const HeroScene = lazy(() => import('./HeroScene'))

const CTA_LIVE_PROGRESS = 0.8
const SOLUTIONS_HREF = '#servicos'

function SceneBackdrop() {
  return <div className="hero__backdrop" />
}

// Canvas único; só é montado depois do primeiro paint para não competir com a entrada tipográfica.
function SceneLayer({
  progress,
  paused,
}: {
  progress?: RefObject<number>
  paused?: boolean
}) {
  const container = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const element = container.current
    if (!element) return

    let timeout: number | undefined
    const mountAfterPaint = () => {
      timeout = window.setTimeout(() => {
        timeout = undefined
        setMounted(true)
      }, 250)
    }

    if (!('IntersectionObserver' in window)) {
      mountAfterPaint()
      return () => {
        if (timeout !== undefined) window.clearTimeout(timeout)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (timeout !== undefined) {
            window.clearTimeout(timeout)
            timeout = undefined
          }
          return
        }

        if (timeout !== undefined) return
        timeout = window.setTimeout(() => {
          timeout = undefined
          const bounds = element.getBoundingClientRect()
          const isNearViewport = bounds.bottom >= -100 && bounds.top <= window.innerHeight + 100
          if (!isNearViewport) return

          observer.disconnect()
          setMounted(true)
        }, 250)
      },
      { rootMargin: '100px 0px' },
    )

    observer.observe(element)
    return () => {
      observer.disconnect()
      if (timeout !== undefined) window.clearTimeout(timeout)
    }
  }, [])

  return (
    <div ref={container} className="hero__canvas" aria-hidden="true">
      <SceneBackdrop />
      {mounted && (
        <Suspense fallback={null}>
          <HeroScene progress={progress} paused={paused} fallback={<SceneBackdrop />} />
        </Suspense>
      )}
    </div>
  )
}

function ActCopy({ act, heading: Heading }: { act: HeroAct; heading: 'h1' | 'h2' }) {
  return (
    <>
      <p className="act__kicker" data-intro>
        <span className="act__index">{act.index}</span>
        {act.kicker}
      </p>
      <Heading className="act__title" data-intro>
        {act.title}
      </Heading>
      <p className="act__text" data-intro>
        {act.text}
      </p>
      {act.secondary && (
        <p className="act__secondary" data-intro>
          {act.secondary}
        </p>
      )}
    </>
  )
}

const HERO_METRICS = [
  { value: '16+', label: 'anos de experiência em WMS' },
  { value: '100%', label: 'foco em multinacionais' },
] as const

function HeroMetrics() {
  return (
    <dl className="act__metrics" data-intro>
      {HERO_METRICS.map(({ value, label }) => (
        <div key={value} className="act__metric">
          <dt>{value}</dt>
          <dd>{label}</dd>
        </div>
      ))}
    </dl>
  )
}

function SolutionsLink({ onFocus }: { onFocus?: (event: FocusEvent<HTMLAnchorElement>) => void }) {
  return (
    <a className="act__cta" href={SOLUTIONS_HREF} onFocus={onFocus}>
      Conheça nossas soluções
      <span className="act__cta-line" aria-hidden="true" />
    </a>
  )
}

function CinematicHero() {
  const track = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const [paused, setPaused] = useState(false)

  useLayoutEffect(() => {
    const element = track.current
    if (!element) return

    const context = gsap.context(() => {
      const acts = gsap.utils.toArray<HTMLElement>('[data-act]')
      const [first, second, third, fourth] = acts
      const line = element.querySelector<HTMLElement>('[data-progress]')

      gsap.set([second, third, fourth], { opacity: 0, y: 48 })
      gsap.from(first.querySelectorAll('[data-intro]'), {
        opacity: 0,
        y: 28,
        duration: 1.2,
        stagger: 0.14,
        ease: 'power3.out',
        delay: 0.15,
      })

      const timeline = gsap.timeline({ defaults: { ease: 'none' } })
      timeline
        .to(first, { opacity: 0, y: -48, duration: 0.12 }, 0.07)
        .fromTo(second, { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 0.07 }, 0.28)
        .to(second, { opacity: 0, y: -48, duration: 0.07 }, 0.43)
        .fromTo(third, { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 0.07 }, 0.53)
        .to(third, { opacity: 0, y: -48, duration: 0.07 }, 0.68)
        .fromTo(fourth, { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 0.09 }, 0.8)
        .set({}, {}, 1)
      if (line) timeline.fromTo(line, { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0)

      ScrollTrigger.create({
        trigger: element,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        animation: timeline,
        onUpdate: (self) => {
          progress.current = self.progress
          fourth.dataset.live = String(self.progress >= CTA_LIVE_PROGRESS)
        },
        onRefresh: (self) => {
          progress.current = self.progress
        },
      })

      // Suspende o render quando o bloco cinematográfico está fora da viewport.
      ScrollTrigger.create({
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => setPaused(!self.isActive),
      })
    }, element)

    return () => context.revert()
  }, [])

  // Quem navega por teclado alcança o botão antes de rolar: levamos a narrativa ao final.
  const revealCta = () => {
    const element = track.current
    if (!element || progress.current >= CTA_LIVE_PROGRESS) return

    window.scrollTo({
      top: element.offsetTop + element.offsetHeight - window.innerHeight,
    })
  }

  return (
    <section ref={track} id="inicio" className="hero hero--cinematic" aria-label="JT Tecnologia">
      <div className="hero__stage">
        <SceneLayer progress={progress} paused={paused} />
        <div className="hero__shade" aria-hidden="true" />

        {HERO_ACTS.map((act, index) => (
          <article key={act.id} className={`act act--${act.id}`} data-act>
            <div className="act__inner">
              <ActCopy act={act} heading={index === 0 ? 'h1' : 'h2'} />
              {act.id === 'solution' && <SolutionsLink onFocus={revealCta} />}
              {act.id === 'physical' && (
                <p className="act__cue" aria-hidden="true" data-intro>
                  <span className="act__cue-line" />
                  Role para explorar
                </p>
              )}
            </div>
            {act.id === 'physical' && <HeroMetrics />}
          </article>
        ))}

        <span className="hero__rail" aria-hidden="true">
          <span className="hero__rail-fill" data-progress />
        </span>
      </div>
    </section>
  )
}

// Movimento reduzido: sem pinning nem câmera animada; conteúdo em sequência vertical.
function StaticHero() {
  return (
    <section id="inicio" className="hero hero--static" aria-label="JT Tecnologia">
      <div className="hero__first">
        <SceneLayer />
        <div className="hero__shade" aria-hidden="true" />
        <article className="act act--physical act--static">
          <div className="act__inner">
            <ActCopy act={HERO_ACTS[0]} heading="h1" />
          </div>
          <HeroMetrics />
        </article>
      </div>

      {HERO_ACTS.slice(1).map((act) => (
        <article key={act.id} className={`act act--${act.id} act--static act--flow`}>
          <div className="act__inner">
            <ActCopy act={act} heading="h2" />
            {act.id === 'solution' && <SolutionsLink />}
          </div>
        </article>
      ))}
    </section>
  )
}

function Hero() {
  const reducedMotion = useReducedMotion()

  return reducedMotion ? <StaticHero /> : <CinematicHero />
}

export default Hero
