import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { ArrowLeft } from 'lucide-react'
import ThreeScene from '../components/three/ThreeScene'
import type { ViewMode } from '../components/three/warehouse/constants'
import WarehouseScene from '../components/three/warehouse/WarehouseScene'
import { HOME_PATH, navigate } from '../lib/navigation'
import '../styles/lab.css'

const MODES: { id: ViewMode; label: string }[] = [
  { id: 'physical', label: 'Physical' },
  { id: 'digital', label: 'Digital' },
]

function LabStatus({ message }: { message: string }) {
  return (
    <div className="lab__status" role="status">
      <p>{message}</p>
    </div>
  )
}

function Lab3DPage() {
  const [mode, setMode] = useState<ViewMode>('physical')

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
          loadingFallback={<LabStatus message="Carregando ambiente 3D…" />}
          fallback={
            <LabStatus message="Não foi possível iniciar o ambiente 3D neste dispositivo." />
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
          Página inicial
        </a>
      </header>

      <div className="lab__controls" role="group" aria-label="Modo de visualização">
        <span className="lab__indicator" aria-hidden="true" />
        {MODES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className="lab__mode"
            aria-pressed={mode === id}
            onClick={() => setMode(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </main>
  )
}

export default Lab3DPage
