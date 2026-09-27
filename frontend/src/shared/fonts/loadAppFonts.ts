import barlowUrl from '@shared/assets/fonts/barlow-700.woff2?url'
import '@envelope/view/presentation/stampCountFont.scss'

export const BARLOW_FONT = '700 16px Barlow'

/** Качаем шрифты сразу при открытии приложения, не дожидаясь печати. */
export function loadAppFonts(): void {
  if (typeof document === 'undefined') return
  const preload = document.createElement('link')
  preload.rel = 'preload'
  preload.as = 'font'
  preload.type = 'font/woff2'
  preload.crossOrigin = 'anonymous'
  preload.href = barlowUrl
  document.head.appendChild(preload)
  void document.fonts.load(BARLOW_FONT)
}

export function isBarlowReady(): boolean {
  return typeof document !== 'undefined' && document.fonts.check(BARLOW_FONT)
}
