import { NAV_ITEMS } from '../../lib/content'

const CURRENT_YEAR = new Date().getFullYear()

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__brand">
        <a href="#inicio">JT TECNOLOGIA</a>
        <p>Especialização em soluções tecnológicas para logística.</p>
        <a className="site-footer__email" href="mailto:contato@jttecnologia.com">
          contato@jttecnologia.com
        </a>
      </div>
      <nav className="site-footer__nav" aria-label="Navegação do rodapé">
        {NAV_ITEMS.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <p className="site-footer__copyright">
        © {CURRENT_YEAR} JT TECNOLOGIA
      </p>
    </footer>
  )
}

export default Footer
