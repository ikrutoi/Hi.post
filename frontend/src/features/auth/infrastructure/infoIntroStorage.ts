const STORAGE_KEY = 'hi.post.infoIntroSeen'

/** Decided once per page load so StrictMode remounts keep the same answer. */
let firstVisitIntro: boolean | null = null

export function shouldStartUserPanelOnInfo(): boolean {
  if (firstVisitIntro == null) {
    firstVisitIntro = !readInfoIntroSeen()
  }
  return firstVisitIntro
}

export function markInfoIntroSeen(): void {
  firstVisitIntro = false
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* private mode / denied */
  }
}

function readInfoIntroSeen(): boolean {
  if (typeof window === 'undefined') return true
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return true
  }
}
