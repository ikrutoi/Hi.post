import type { IconState } from '@shared/config/constants'

/** Matches $color-font-disabled */
export const APPLY_TOOLBAR_COLOR_DISABLED = 'hsl(0, 0%, 74%)'

/** Matches $color-font-enabled-light */
export const APPLY_TOOLBAR_COLOR_ENABLED = 'hsl(0, 0%, 42%)'

/** Matches $color-indicator-hight */
export const APPLY_TOOLBAR_COLOR_SELECTED = '#4caf50'

export const getApplyToolbarIconColor = (
  status: IconState | undefined,
): string => {
  if (status === 'disabled') return APPLY_TOOLBAR_COLOR_DISABLED
  if (status === 'selected' || status === 'active') {
    return APPLY_TOOLBAR_COLOR_SELECTED
  }
  return APPLY_TOOLBAR_COLOR_ENABLED
}
