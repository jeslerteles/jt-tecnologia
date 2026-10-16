import { SERVICES } from '../lib/content'

function Solutions() {
  return (
    <section id="servicos" className="solutions" aria-labelledby="solutions-title">
      <div className="solutions__intro">
        <p className="eyebrow" data-reveal>
          Serviços / 01—06
        </p>
        <h2 id="solutions-title" className="solutions__title">
          SOLUÇÕES COMPLETAS
        </h2>
        <p className="solutions__subtitle" data-reveal>
          Tecnologia para toda a sua operação logística.
        </p>
      </div>

      <ol className="solutions__list">
        {SERVICES.map((service, index) => (
          <li key={service.title} className="solutions__item" data-reveal>
            <span className="solutions__index">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="solutions__name">{service.title}</h3>
            <p className="solutions__description">{service.description}</p>
            <span className="solutions__marker" aria-hidden="true" />
          </li>
        ))}
      </ol>
    </section>
  )
}

export default Solutions
