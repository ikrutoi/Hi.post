import barlowSemiBoldUrl from '@shared/assets/fonts/barlow-600.woff2?url'
import barlowSemiCondensedUrl from '@shared/assets/fonts/barlow-semi-condensed-700-italic.woff2?url'
import '@envelope/view/presentation/stampCountFont.scss'
import '@shared/fonts/barlowSemiCondensed.scss'

export const BARLOW_FONT = '600 16px Barlow'
export const BARLOW_SEMI_CONDENSED_FONT = "italic 700 16px 'Barlow Semi Condensed'"

function preloadFont(href: string): void {
  const preload = document.createElement('link')
  preload.rel = 'preload'
  preload.as = 'font'
  preload.type = 'font/woff2'
  preload.crossOrigin = 'anonymous'
  preload.href = href
  document.head.appendChild(preload)
}

/** Качаем шрифты сразу при открытии приложения, не дожидаясь печати. */
export function loadAppFonts(): void {
  if (typeof document === 'undefined') return
  preloadFont(barlowSemiBoldUrl)
  preloadFont(barlowSemiCondensedUrl)
  void document.fonts.load(BARLOW_FONT)
  void document.fonts.load(BARLOW_SEMI_CONDENSED_FONT)
}

export function isBarlowReady(): boolean {
  return typeof document !== 'undefined' && document.fonts.check(BARLOW_FONT)
}
