export function resolveCardphotoAddToolbarState(params: {
  /** After applyLight: processed slot still exists (Add reopens it). */
  hasPendingProcessed: boolean
  /** Оригинал загрузки в памяти, create закрыт — кружок-напоминание. */
  shouldShowOriginalDot: boolean
}): {
  state: 'enabled'
  options: { badge: number | null; badgeDot: boolean }
} {
  const { hasPendingProcessed, shouldShowOriginalDot } = params

  return {
    state: 'enabled',
    options: {
      badge: null,
      /** Original in memory and/or unsaved processed: same ball, Add restores it. */
      badgeDot: shouldShowOriginalDot || hasPendingProcessed,
    },
  }
}
