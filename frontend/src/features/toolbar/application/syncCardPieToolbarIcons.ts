import type { AppDispatch } from '@app/state'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import type { IconState } from '@shared/config/constants'
import type { ToolbarSection } from '@toolbar/domain/types'

export const CARD_PIE_TOOLBAR_SECTIONS = [
  'editorPie',
  'date',
  'sectionEditorMenu',
] as const satisfies readonly ToolbarSection[]

export function dispatchCardPieToolbarIconState(
  dispatch: AppDispatch,
  active: boolean,
) {
  const value: IconState = active ? 'active' : 'enabled'
  for (const section of CARD_PIE_TOOLBAR_SECTIONS) {
    dispatch(
      updateToolbarIcon({
        section,
        key: 'cardPie',
        value,
      }),
    )
  }
}

export function dispatchCardPieToolbarBadge(
  dispatch: AppDispatch,
  count: number,
) {
  const badge = count > 0 ? count : null
  for (const section of CARD_PIE_TOOLBAR_SECTIONS) {
    dispatch(
      updateToolbarIcon({
        section,
        key: 'cardPie',
        value: {
          options: { badge },
        },
      }),
    )
  }
}
