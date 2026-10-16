import { useSyncExternalStore } from 'react'

export const HOME_PATH = '/'
export const LAB_PATH = '/lab-3d'

const NAVIGATE_EVENT = 'jt:navigate'

function normalizePath(pathname: string) {
  return pathname.replace(/\/+$/, '') || HOME_PATH
}

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange)
  window.addEventListener(NAVIGATE_EVENT, onChange)

  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener(NAVIGATE_EVENT, onChange)
  }
}

export function usePathname() {
  return useSyncExternalStore(
    subscribe,
    () => normalizePath(window.location.pathname),
    () => HOME_PATH,
  )
}

export function navigate(to: string) {
  if (normalizePath(window.location.pathname) === to) return

  window.history.pushState(null, '', to)
  window.dispatchEvent(new Event(NAVIGATE_EVENT))
  window.scrollTo(0, 0)
}
