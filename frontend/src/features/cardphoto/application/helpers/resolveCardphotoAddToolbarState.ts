export function resolveCardphotoAddToolbarState(params: {
  /** After applyLight: processed slot still exists (Add reopens it). */
  hasPendingProcessed: boolean
  /** Оригинал загрузки в памяти, create закрыт — кружок-напоминание. */
  shouldShowOriginalDot: boolean
  /** Gallery / reopen / IDB prep in progress — block repeat taps. */
  isLoading?: boolean
}): {
  state: 'enabled' | 'disabled'
  options: { badge: number | null; badgeDot: boolean }
} {
  const { hasPendingProcessed, shouldShowOriginalDot, isLoading } = params

  if (isLoading) {
    return {
      state: 'disabled',
      options: { badge: null, badgeDot: false },
    }
  }

  return {
    state: 'enabled',
    options: {
      badge: null,
      /** Original in memory and/or unsaved processed: same ball, Add restores it. */
      badgeDot: shouldShowOriginalDot || hasPendingProcessed,
    },
  }
}
