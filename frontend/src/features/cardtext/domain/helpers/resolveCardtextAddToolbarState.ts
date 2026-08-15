export function resolveCardtextAddToolbarState(params: {
  /** Редактор создания открыт и пользователь печатает. */
  createEditorOpenForTyping: boolean
  /** В БД есть processed-слот (после applyLight, до addList / apply на открытке). */
  hasPendingProcessed: boolean
  /** View с текстом, звезда выключена (нет в быстром списке). */
  viewTextPendingBadge?: boolean
  /** Черновик до первого applyLight — точка, не цифра. */
  shouldShowDraftDot: boolean
}): {
  state: 'enabled' | 'disabled'
  options: { badge: number | null; badgeDot: boolean }
} {
  const {
    createEditorOpenForTyping,
    hasPendingProcessed,
    viewTextPendingBadge = false,
    shouldShowDraftDot,
  } = params

  const badge = hasPendingProcessed || viewTextPendingBadge ? 1 : null
  const badgeDot = shouldShowDraftDot && badge == null

  if (createEditorOpenForTyping || viewTextPendingBadge) {
    return { state: 'disabled', options: { badge, badgeDot } }
  }

  return { state: 'enabled', options: { badge, badgeDot } }
}
