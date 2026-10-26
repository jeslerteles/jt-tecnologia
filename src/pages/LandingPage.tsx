import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useLanguage } from '../lib/useLanguage'
import Hero from '../sections/Hero'
import InstitutionalSections from '../sections/InstitutionalSections'
import Solutions from '../sections/Solutions'
import '../styles/home.css'
import '../styles/institutional.css'

gsap.registerPlugin(ScrollTrigger)

function LandingPage() {
  const main = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { copy } = useLanguage()

  useLayoutEffect(() => {
    const element = main.current
    if (!element || reducedMotion) return

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((target) => {
        gsap.fromTo(
          target,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: target,
              start: 'top 88%',
              once: true,
            },
          },
        )
      })

      const process = element.querySelector<HTMLElement>('.process')
      const trace = process?.querySelector<HTMLElement>('[data-process-trace]')
      const nodes = process?.querySelectorAll<HTMLElement>('[data-process-node]')

      if (process && trace && nodes?.length) {
        gsap.set(trace, { '--trace-progress': 0 })
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: process,
            start: 'top 72%',
            once: true,
          },
        })

        timeline.to(trace, { '--trace-progress': 1, duration: 2.6, ease: 'power1.inOut' }, 0)
        nodes.forEach((node, index) => {
          const pulseAt = index * 0.42
          timeline
            .to(
              node,
              {
                scale: 1.25,
                boxShadow: '0 0 0 5px #07111b, 0 0 16px rgb(57 188 224 / 75%)',
                duration: 0.2,
                ease: 'power2.out',
              },
              pulseAt,
            )
            .to(
              node,
              {
                scale: 1,
                boxShadow: '0 0 0 5px #07111b',
                duration: 0.32,
                ease: 'power2.inOut',
              },
              pulseAt + 0.2,
            )
        })
      }

      const contactTitle = element.querySelector<HTMLElement>('[data-contact-title]')
      const contactLines = contactTitle?.querySelectorAll<HTMLElement>('[data-contact-line]')

      if (contactTitle && contactLines?.length) {
        gsap.fromTo(
          contactLines,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.14,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: contactTitle,
              start: 'top 82%',
              once: true,
            },
          },
        )
      }
    }, element)

    return () => context.revert()
  }, [reducedMotion])

  return (
    <>
      <a className="skip-link" href="#servicos">
        {copy.skipLink}
      </a>
      <Header />
      <main ref={main}>
        <Hero />
        <Solutions />
        <InstitutionalSections />
      </main>
      <Footer />
    </>
  )
}

export default LandingPage
