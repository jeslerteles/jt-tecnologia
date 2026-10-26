import { NAV_ITEMS } from '../../lib/content'
import { useLanguage } from '../../lib/useLanguage'

const CURRENT_YEAR = new Date().getFullYear()

function Footer() {
  const { copy } = useLanguage()

  return (
    <footer className="site-footer">
      <div className="site-footer__brand">
        <a href="#inicio">JT TECNOLOGIA</a>
        <p>{copy.footer.description}</p>
        <a className="site-footer__email" href="mailto:contato@jt-tecnologia.com">
          contato@jt-tecnologia.com
        </a>
        <a
          className="contact__link site-footer__whatsapp"
          href="https://wa.me/5515991563052"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={copy.contact.whatsappAria}
        >
          <span className="contact__whatsapp-label">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.4-5a8.4 8.4 0 1 1 16.1-3.8Z" />
              <path d="M9 8.2c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.8 1.8c.1.2.1.4-.1.6l-.6.7c-.2.2-.2.4-.1.6.5.9 1.2 1.6 2.1 2.1.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.7.8c.3.1.4.3.4.5 0 .3-.2 1.1-.7 1.5-.5.4-1.1.6-1.8.4-1-.2-2.3-.8-3.6-2-1.1-1-1.9-2.2-2.2-3.2-.3-.8 0-1.6.4-2.2Z" />
            </svg>
            {copy.contact.whatsapp}
          </span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
      <nav className="site-footer__nav" aria-label={copy.footer.navLabel}>
        {NAV_ITEMS.map((item, index) => (
          <a href={item.href} key={item.href}>
            {copy.nav[index]}
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
