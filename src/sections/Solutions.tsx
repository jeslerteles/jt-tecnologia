import { useLanguage } from '../lib/useLanguage'

function Solutions() {
  const { copy } = useLanguage()

  return (
    <section id="servicos" className="solutions" aria-labelledby="solutions-title">
      <div className="solutions__intro">
        <p className="eyebrow" data-reveal>
          {copy.solutions.eyebrow}
        </p>
        <h2 id="solutions-title" className="solutions__title">
          {copy.solutions.title}
        </h2>
        <p className="solutions__subtitle" data-reveal>
          {copy.solutions.subtitle}
        </p>
      </div>

      <ol className="solutions__list">
        {copy.solutions.items.map((service, index) => (
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
