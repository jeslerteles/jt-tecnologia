import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLanguage } from '../lib/useLanguage'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/meaerybp'

async function readFormspreeError(response: Response, fallback: string): Promise<string> {
  try {
    const payload: unknown = await response.json()
    if (typeof payload === 'object' && payload !== null && 'errors' in payload) {
      const errors = (payload as { errors: unknown }).errors
      if (Array.isArray(errors)) {
        const first = errors.find(
          (item): item is { message: string } =>
            typeof item === 'object' &&
            item !== null &&
            typeof (item as { message?: unknown }).message === 'string',
        )
        if (first) return `${fallback} (${first.message})`
      }
    }
  } catch {
    // Resposta sem JSON: usa a mensagem padrão.
  }
  return fallback
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="eyebrow" data-reveal>
      {children}
    </p>
  )
}

function Implementation() {
  const { copy } = useLanguage()

  return (
    <section id="implantacao" className="implementation" aria-labelledby="implementation-title">
      <div className="implementation__intro">
        <SectionLabel>{copy.implementation.eyebrow}</SectionLabel>
        <h2 id="implementation-title" className="editorial-title" data-reveal>
          {copy.implementation.title[0]}
          <br />
          {copy.implementation.title[1]}
        </h2>
        <p className="section-lead" data-reveal>
          {copy.implementation.lead}
        </p>
      </div>

      <div className="process__track">
        <span className="process__spine" aria-hidden="true">
          <span className="process__trace" data-process-trace />
        </span>
        <ol className="process">
          {copy.implementation.steps.map((step, index) => (
            <li className="process__step" key={step.title} data-reveal>
              <span className="process__number">{String(index + 1).padStart(2, '0')}</span>
              <div className="process__copy">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              <span className="process__node" aria-hidden="true" data-process-node />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function KnowledgeDiagram() {
  const { copy } = useLanguage()

  return (
    <svg
      className="knowledge-diagram"
      viewBox="0 0 420 300"
      role="img"
      aria-labelledby="knowledge-diagram-title knowledge-diagram-desc"
    >
      <title id="knowledge-diagram-title">{copy.training.diagramTitle}</title>
      <desc id="knowledge-diagram-desc">
        {copy.training.diagramDescription}
      </desc>
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path
          className="knowledge-diagram__line"
          d="M210 150 91 78M210 150l119-72M210 150l-1 112"
        />
        <circle className="knowledge-diagram__orbit" cx="210" cy="150" r="88" />
        <circle className="knowledge-diagram__halo" cx="210" cy="150" r="53" />
        <circle className="knowledge-diagram__core" cx="210" cy="150" r="43" />
        <circle className="knowledge-diagram__node" cx="91" cy="78" r="6" />
        <circle className="knowledge-diagram__node" cx="329" cy="78" r="6" />
        <circle className="knowledge-diagram__node" cx="209" cy="262" r="6" />
      </g>
      <g className="knowledge-diagram__labels">
        <text x="52" y="57">{copy.training.diagramLabels[0]}</text>
        <text x="290" y="57">{copy.training.diagramLabels[1]}</text>
        <text x="178" y="290">{copy.training.diagramLabels[2]}</text>
        <text x="178" y="154">{copy.training.diagramLabels[3]}</text>
      </g>
      <path
        className="knowledge-diagram__signal knowledge-diagram__signal--people"
        d="M116 95 190 140"
      />
      <path
        className="knowledge-diagram__signal knowledge-diagram__signal--process"
        d="M304 95 230 140"
      />
      <path
        className="knowledge-diagram__signal knowledge-diagram__signal--technology"
        d="M209 253 210 199"
      />
    </svg>
  )
}

function Training() {
  const { copy } = useLanguage()

  return (
    <section id="treinamentos" className="training" aria-labelledby="training-title">
      <div className="training__intro">
        <SectionLabel>{copy.training.eyebrow}</SectionLabel>
        <h2 id="training-title" className="editorial-title" data-reveal>
          {copy.training.title[0]}
          <br />
          {copy.training.title[1]}
          <br />
          {copy.training.title[2]}
        </h2>
        <p className="section-lead" data-reveal>
          {copy.training.lead}
        </p>
        <KnowledgeDiagram />
      </div>

      <ol className="training__list">
        {copy.training.items.map((item, index) => (
          <li key={item} data-reveal>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p>{item}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function SystemGraphic() {
  const { copy } = useLanguage()

  return (
    <div className="system-graphic" aria-hidden="true">
      <div className="system-graphic__column">
        <span>{copy.support.graphicLabels[0]}</span>
        <i />
      </div>
      <div className="system-graphic__links">
        <i />
        <i />
        <i />
      </div>
      <div className="system-graphic__core">JT</div>
      <div className="system-graphic__links system-graphic__links--right">
        <i />
        <i />
        <i />
      </div>
      <div className="system-graphic__column">
        <span>{copy.support.graphicLabels[1]}</span>
        <i />
      </div>
    </div>
  )
}

function Support() {
  const { copy } = useLanguage()

  return (
    <section id="suporte" className="support" aria-labelledby="support-title">
      <div className="support__intro">
        <SectionLabel>{copy.support.eyebrow}</SectionLabel>
        <h2 id="support-title" className="editorial-title" data-reveal>
          {copy.support.title[0]}
          <br />
          {copy.support.title[1]}
        </h2>
        <p className="section-lead" data-reveal>
          {copy.support.lead}
        </p>
        <SystemGraphic />
      </div>
      <ol className="support__list">
        {copy.support.items.map((capability, index) => (
          <li key={capability} data-reveal>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{capability}</h3>
            <i aria-hidden="true" />
          </li>
        ))}
      </ol>
    </section>
  )
}

function Clients() {
  const { copy } = useLanguage()

  return (
    <section id="clientes" className="clients" aria-labelledby="clients-title">
      <div className="clients__copy">
        <SectionLabel>{copy.clients.eyebrow}</SectionLabel>
        <h2 id="clients-title" className="editorial-title" data-reveal>
          {copy.clients.title}
        </h2>
        <p className="section-lead" data-reveal>
          {copy.clients.lead}
        </p>
      </div>
      <ConnectivityNetwork />
      <DeploymentsList />
    </section>
  )
}

const DEPLOYMENT_COMPANIES = [
  { id: 'asics', name: 'asics' },
  { id: 'vivo', name: 'vivo' },
  { id: 'milaha', name: 'MILAHA LOGISTICS' },
  { id: 'fedex', name: 'FedEx' },
  { id: 'loccitane', name: "L'OCCITANE" },
  { id: 'pg', name: 'P&G' },
  { id: 'hp', name: 'hp' },
  { id: 'dhl', name: 'DHL' },
] as const

// Logotipos oficiais autorizados devem ser adicionados em src/assets/images/logos/<id>.svg.
// Enquanto o arquivo não existir, o nome da empresa é exibido em texto.
const LOGO_FILES = import.meta.glob<string>('../assets/images/logos/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})

function DeploymentsList() {
  const { copy } = useLanguage()

  return (
    <div className="deployments" data-reveal>
      <h3 className="deployments__title" id="deployments-title">
        {copy.clients.deployments}
      </h3>
      <ul className="deployments__list" aria-labelledby="deployments-title">
        {DEPLOYMENT_COMPANIES.map(({ id, name }) => {
          const logo = LOGO_FILES[`../assets/images/logos/${id}.svg`]
          return (
            <li key={id} className="deployments__item" data-brand={id}>
              {logo ? (
                <img src={logo} alt={name} className="deployments__logo" loading="lazy" />
              ) : (
                <span className="deployments__name">{name}</span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function ConnectivityNetwork() {
  return (
    <svg
      className="connectivity-network"
      viewBox="0 0 560 360"
      aria-hidden="true"
      focusable="false"
    >
      <g className="connectivity-network__depth">
        <path d="M72 183 146 92 251 130 343 68 472 122 505 231 406 294 296 236 179 287 72 183Z" />
        <path d="m146 92 33 195m72-157 45 106m47-168 63 226m66-172-109 226M72 183l179-53 221 101-109 63-184-58-107-53Z" />
      </g>
      <g className="connectivity-network__links">
        <path d="M72 183 146 92 251 130 343 68 472 122 505 231 406 294 296 236 179 287 72 183Z" />
        <path d="m146 92 33 195m72-157 45 106m47-168 63 226m66-172-109 226M72 183l179-53 221 101-109 63-184-58-107-53Z" />
      </g>
      <g className="connectivity-network__nodes">
        <circle cx="72" cy="183" r="5" />
        <circle cx="146" cy="92" r="4" />
        <circle cx="251" cy="130" r="6" />
        <circle cx="343" cy="68" r="4" />
        <circle cx="472" cy="122" r="5" />
        <circle cx="505" cy="231" r="4" />
        <circle cx="406" cy="294" r="6" />
        <circle cx="296" cy="236" r="4" />
        <circle cx="179" cy="287" r="5" />
      </g>
      <circle className="connectivity-network__hub" cx="296" cy="180" r="9" />
      <circle className="connectivity-network__hub-ring" cx="296" cy="180" r="18" />
    </svg>
  )
}

function Contact() {
  const { copy } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    const form = event.currentTarget
    const formData = new FormData(form)
    // Campo legado/injetado por autofill ou extensões; não faz parte do formulário.
    formData.delete('website')
    setIsSubmitting(true)
    setFeedback(null)

    let response: Response
    try {
      response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })
    } catch {
      setFeedback({
        type: 'error',
        message: copy.contact.networkError,
      })
      setIsSubmitting(false)
      return
    }

    if (!response.ok) {
      setFeedback({
        type: 'error',
        message: await readFormspreeError(response, copy.contact.sendError),
      })
      setIsSubmitting(false)
      return
    }

    form.reset()
    setFeedback({ type: 'success', message: copy.contact.success })
    setIsSubmitting(false)
  }

  return (
    <section id="contato" className="contact" aria-labelledby="contact-title">
      <SectionLabel>{copy.contact.eyebrow}</SectionLabel>
      <h2 id="contact-title" className="contact__title" data-contact-title>
        {copy.contact.title.map((line) => <span key={line} data-contact-line>{line}</span>)}
      </h2>
      <div className="contact__bottom" data-reveal>
        <p>
          {copy.contact.lead}
        </p>
      </div>
      <form className="contact__form" onSubmit={handleSubmit}>
        <div className="contact__fields">
          <label className="contact__field">
            <span>{copy.contact.name}</span>
            <input
              autoComplete="name"
              maxLength={120}
              name="name"
              required
              type="text"
            />
          </label>
          <label className="contact__field">
            <span>{copy.contact.email}</span>
            <input
              autoComplete="email"
              maxLength={254}
              name="email"
              required
              type="email"
            />
          </label>
          <label className="contact__field contact__field--message">
            <span>{copy.contact.message}</span>
            <textarea maxLength={5000} name="message" required rows={4} />
          </label>
          <label className="contact__honeypot" aria-hidden="true">
            <span>{copy.contact.honeypot}</span>
            <input
              autoComplete="off"
              name="_gotcha"
              tabIndex={-1}
              type="text"
            />
          </label>
        </div>
        <div className="contact__submit-row">
          <button className="contact__link contact__submit" disabled={isSubmitting} type="submit">
            <span>{isSubmitting ? copy.contact.submitting : copy.contact.submit}</span>
            <span aria-hidden="true">↗</span>
          </button>
          {feedback && (
            <p
              className={`contact__feedback contact__feedback--${feedback.type}`}
              role={feedback.type === 'error' ? 'alert' : 'status'}
            >
              {feedback.message}
            </p>
          )}
        </div>
      </form>
    </section>
  )
}

function InstitutionalSections() {
  return (
    <>
      <Implementation />
      <Training />
      <Support />
      <Clients />
      <Contact />
    </>
  )
}

export default InstitutionalSections
