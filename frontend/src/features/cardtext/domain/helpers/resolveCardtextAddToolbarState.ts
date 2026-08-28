export function resolveCardtextAddToolbarState(params: {
  /** Редактор создания открыт и пользователь печатает. */
  createEditorOpenForTyping: boolean
  /** Working copy not in templates (draft or processed) — reminder dot. */
  shouldShowDraftDot: boolean
}): {
  state: 'enabled' | 'disabled'
  options: { badge: number | null; badgeDot: boolean }
} {
  const { createEditorOpenForTyping, shouldShowDraftDot } = params

  if (createEditorOpenForTyping) {
    return {
      state: 'disabled',
      options: { badge: null, badgeDot: false },
    }
  }

  return {
    state: 'enabled',
    options: { badge: null, badgeDot: shouldShowDraftDot },
  }
}
