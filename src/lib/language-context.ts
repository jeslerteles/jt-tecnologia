import { createContext } from 'react'
import type { Copy, Language } from './language-copy'

export interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  copy: Copy
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)
