import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  IMPLEMENTATION_STEPS,
  SUPPORT_CAPABILITIES,
  TRAINING_ITEMS,
} from '../lib/content'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/meaerybp'

const SEND_ERROR_MESSAGE =
  'Não foi possível enviar sua mensagem. Tente novamente ou use o e-mail público informado na página.'

async function readFormspreeError(response: Response): Promise<string> {
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
        if (first) return `${SEND_ERROR_MESSAGE} (${first.message})`
      }
    }
  } catch {
    // Resposta sem JSON: usa a mensagem padrão.
  }
  return SEND_ERROR_MESSAGE
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="eyebrow" data-reveal>
      {children}
    </p>
  )
}

function Implementation() {
  return (
    <section id="implantacao" className="implementation" aria-labelledby="implementation-title">
      <div className="implementation__intro">
        <SectionLabel>Implantação / Método</SectionLabel>
        <h2 id="implementation-title" className="editorial-title" data-reveal>
          DA ESTRATÉGIA
          <br />
          À OPERAÇÃO
        </h2>
        <p className="section-lead" data-reveal>
          Uma metodologia estruturada para reduzir riscos e assegurar a continuidade operacional.
        </p>
      </div>

      <div className="process__track">
        <span className="process__spine" aria-hidden="true">
          <span className="process__trace" data-process-trace />
        </span>
        <ol className="process">
          {IMPLEMENTATION_STEPS.map((step, index) => (
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
  return (
    <svg
      className="knowledge-diagram"
      viewBox="0 0 420 300"
      role="img"
      aria-labelledby="knowledge-diagram-title knowledge-diagram-desc"
    >
      <title id="knowledge-diagram-title">Fluxo de conhecimento operacional</title>
      <desc id="knowledge-diagram-desc">
        Um núcleo de conhecimento conecta pessoas, processos e tecnologia.
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
        <text x="52" y="57">PESSOAS</text>
        <text x="290" y="57">PROCESSOS</text>
        <text x="178" y="290">TECNOLOGIA</text>
        <text x="178" y="154">CONHECIMENTO</text>
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
  return (
    <section id="treinamentos" className="training" aria-labelledby="training-title">
      <div className="training__intro">
        <SectionLabel>Treinamentos / Pessoas &amp; operação</SectionLabel>
        <h2 id="training-title" className="editorial-title" data-reveal>
          CONHECIMENTO
          <br />
          QUE SUSTENTA
          <br />
          A OPERAÇÃO
        </h2>
        <p className="section-lead" data-reveal>
          A eficiência de um sistema depende também das pessoas que o utilizam. A JT Tecnologia
          desenvolve treinamentos direcionados às diferentes funções envolvidas na operação
          logística.
        </p>
        <KnowledgeDiagram />
      </div>

      <ol className="training__list">
        {TRAINING_ITEMS.map((item, index) => (
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
  return (
    <div className="system-graphic" aria-hidden="true">
      <div className="system-graphic__column">
        <span>OPERAÇÃO</span>
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
        <span>SISTEMAS</span>
        <i />
      </div>
    </div>
  )
}

function Support() {
  return (
    <section id="suporte" className="support" aria-labelledby="support-title">
      <div className="support__intro">
        <SectionLabel>Suporte / Continuidade</SectionLabel>
        <h2 id="support-title" className="editorial-title" data-reveal>
          CONTINUIDADE
          <br />
          OPERACIONAL
        </h2>
        <p className="section-lead" data-reveal>
          Tecnologia, acompanhamento e evolução para manter sua operação em funcionamento.
        </p>
        <SystemGraphic />
      </div>
      <ol className="support__list">
        {SUPPORT_CAPABILITIES.map((capability, index) => (
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
  return (
    <section id="clientes" className="clients" aria-labelledby="clients-title">
      <div className="clients__copy">
        <SectionLabel>Experiência / Escala</SectionLabel>
        <h2 id="clients-title" className="editorial-title" data-reveal>
          EXPERIÊNCIA EM OPERAÇÕES DE GRANDE ESCALA
        </h2>
        <p className="section-lead" data-reveal>
          Experiência em projetos e implantações de sistemas para operações logísticas de empresas
          multinacionais.
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
  return (
    <div className="deployments" data-reveal>
      <h3 className="deployments__title" id="deployments-title">
        IMPLANTAÇÕES REALIZADAS EM
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
        message:
          'Não foi possível conectar ao serviço de envio. Verifique sua conexão e tente novamente, ou use o e-mail público informado na página.',
      })
      setIsSubmitting(false)
      return
    }

    if (!response.ok) {
      setFeedback({ type: 'error', message: await readFormspreeError(response) })
      setIsSubmitting(false)
      return
    }

    form.reset()
    setFeedback({ type: 'success', message: 'Mensagem enviada. Agradecemos o contato.' })
    setIsSubmitting(false)
  }

  return (
    <section id="contato" className="contact" aria-labelledby="contact-title">
      <SectionLabel>Contato / Próximo passo</SectionLabel>
      <h2 id="contact-title" className="contact__title" data-contact-title>
        <span data-contact-line>VAMOS CONECTAR</span>
        <span data-contact-line>SUA OPERAÇÃO</span>
        <span data-contact-line>AO PRÓXIMO NÍVEL.</span>
      </h2>
      <div className="contact__bottom" data-reveal>
        <p>
          Converse com nossos especialistas e descubra como a JT Tecnologia pode contribuir para a
          evolução da sua operação logística.
        </p>
        <a
          className="contact__link"
          href="https://wa.me/5515991000659"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Entrar em contato pelo WhatsApp"
        >
          <span className="contact__whatsapp-label">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.4-5a8.4 8.4 0 1 1 16.1-3.8Z" />
              <path d="M9 8.2c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.8 1.8c.1.2.1.4-.1.6l-.6.7c-.2.2-.2.4-.1.6.5.9 1.2 1.6 2.1 2.1.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.7.8c.3.1.4.3.4.5 0 .3-.2 1.1-.7 1.5-.5.4-1.1.6-1.8.4-1-.2-2.3-.8-3.6-2-1.1-1-1.9-2.2-2.2-3.2-.3-.8 0-1.6.4-2.2Z" />
            </svg>
            ENTRAR EM CONTATO
          </span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
      <form className="contact__form" onSubmit={handleSubmit}>
        <div className="contact__fields">
          <label className="contact__field">
            <span>SEU NOME</span>
            <input
              autoComplete="name"
              maxLength={120}
              name="name"
              required
              type="text"
            />
          </label>
          <label className="contact__field">
            <span>SEU E-MAIL</span>
            <input
              autoComplete="email"
              maxLength={254}
              name="email"
              required
              type="email"
            />
          </label>
          <label className="contact__field contact__field--message">
            <span>COMO PODEMOS AJUDAR?</span>
            <textarea maxLength={5000} name="message" required rows={4} />
          </label>
          <label className="contact__honeypot" aria-hidden="true">
            <span>Não preencha este campo</span>
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
            <span>{isSubmitting ? 'ENVIANDO…' : 'ENVIAR MENSAGEM'}</span>
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
