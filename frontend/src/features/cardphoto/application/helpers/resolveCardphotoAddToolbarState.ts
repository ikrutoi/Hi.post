export function resolveCardphotoAddToolbarState(params: {
  /** После applyLight: processed-слот в cardphotoView, до addList / apply на открытке. */
  hasPendingProcessed: boolean
  /** Оригинал загрузки в памяти, create закрыт — кружок-напоминание. */
  shouldShowOriginalDot: boolean
}): {
  state: 'enabled'
  options: { badge: number | null; badgeDot: boolean }
} {
  const { hasPendingProcessed, shouldShowOriginalDot } = params

  const badge = hasPendingProcessed ? 1 : null
  const badgeDot = shouldShowOriginalDot && !hasPendingProcessed

  return { state: 'enabled', options: { badge, badgeDot } }
}
