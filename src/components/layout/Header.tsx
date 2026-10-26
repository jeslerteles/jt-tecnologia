import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NAV_ITEMS } from '../../lib/content'
import { useLanguage } from '../../lib/useLanguage'

const SCROLLED_AT = 48

function Header() {
  const { language, setLanguage, copy } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > SCROLLED_AT)

    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="site-header" data-scrolled={scrolled || open} data-open={open}>
      <a className="site-header__brand" href="#inicio" onClick={() => setOpen(false)}>
        JT TECNOLOGIA
      </a>

      <button
        type="button"
        className="site-header__toggle"
        aria-expanded={open}
        aria-controls="site-nav"
        aria-label={open ? copy.header.menuClose : copy.header.menuOpen}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
      </button>

      <nav id="site-nav" className="site-header__nav" aria-label={copy.header.navLabel}>
        <ul>
          {NAV_ITEMS.map((item, index) => (
            <li key={item.href}>
              <a href={item.href} onClick={() => setOpen(false)}>
                  {copy.nav[index]}
                </a>
            </li>
          ))}
        </ul>
      </nav>

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
  )
}

export default Header
