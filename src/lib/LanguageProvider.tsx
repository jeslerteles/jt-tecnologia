import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { COPY, type Language } from './language-copy'
import { LanguageContext } from './language-context'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt')

  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : language
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, copy: COPY[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}
