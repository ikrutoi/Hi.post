export function resolveCardtextAddToolbarState(params: {
  /** Редактор создания открыт и пользователь печатает. */
  createEditorOpenForTyping: boolean
  /** В БД есть processed-слот (после applyLight, до addList / apply на открытке). */
  hasPendingProcessed: boolean
  /** Черновик до первого applyLight — точка, не цифра. */
  shouldShowDraftDot: boolean
}): {
  state: 'enabled' | 'disabled'
  options: { badge: number | null; badgeDot: boolean }
} {
  const { createEditorOpenForTyping, hasPendingProcessed, shouldShowDraftDot } =
    params

  const badge = hasPendingProcessed ? 1 : null
  const badgeDot = shouldShowDraftDot

  if (createEditorOpenForTyping) {
    return { state: 'disabled', options: { badge, badgeDot } }
  }

  return { state: 'enabled', options: { badge, badgeDot } }
}
