import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { ArrowLeft } from 'lucide-react'
import ThreeScene from '../components/three/ThreeScene'
import type { ViewMode } from '../components/three/warehouse/constants'
import WarehouseScene from '../components/three/warehouse/WarehouseScene'
import { useLanguage } from '../lib/useLanguage'
import { HOME_PATH, navigate } from '../lib/navigation'
import '../styles/lab.css'

function LabStatus({ message }: { message: string }) {
  return (
    <div className="lab__status" role="status">
      <p>{message}</p>
    </div>
  )
}

function Lab3DPage() {
  const [mode, setMode] = useState<ViewMode>('physical')
  const { language, setLanguage, copy } = useLanguage()

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'JT Tecnologia — 3D Lab'

    return () => {
      document.title = previousTitle
    }
  }, [])

  const handleBack = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return

    event.preventDefault()
    navigate(HOME_PATH)
  }

  return (
    <main className="lab" data-mode={mode}>
      <div className="lab__viewport">
        <ThreeScene
          reducedMotion="static"
          loadingFallback={<LabStatus message={copy.lab.loading} />}
          fallback={
            <LabStatus message={copy.lab.unavailable} />
          }
        >
          <WarehouseScene mode={mode} />
        </ThreeScene>
      </div>

      <div className="lab__vignette" aria-hidden="true" />

      <header className="lab__header">
        <p className="lab__identity">
          <span className="lab__mark" aria-hidden="true" />
          JT TECNOLOGIA / 3D LAB
        </p>

        <a className="lab__back" href={HOME_PATH} onClick={handleBack}>
          <ArrowLeft size={14} strokeWidth={1.75} aria-hidden="true" />
          {copy.lab.back}
        </a>
        <div className="language-switch" role="group" aria-label={copy.header.languageLabel}>
          {(['en', 'es', 'pt'] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-label={option === 'en' ? 'English' : option === 'es' ? 'Español' : 'Português do Brasil'}
              aria-pressed={language === option}
              onClick={() => setLanguage(option)}
            >
              {option.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <div className="lab__controls" role="group" aria-label={copy.lab.modeLabel}>
        <span className="lab__indicator" aria-hidden="true" />
        {(['physical', 'digital'] as const).map((id, index) => (
          <button
            key={id}
            type="button"
            className="lab__mode"
            aria-pressed={mode === id}
            onClick={() => setMode(id)}
          >
            {copy.lab.modes[index]}
          </button>
        ))}
      </div>
    </main>
  )
}

export default Lab3DPage
