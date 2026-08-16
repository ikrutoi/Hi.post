import type { AppDispatch } from '@app/state'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  setCardtextEditReturnTo,
  setCardtextViewEditMode,
  setDraftEngaged,
  setDraftFocus,
  type CardtextEditReturnTo,
} from '@cardtext/infrastructure/state'
import type { CardtextStatus } from '@cardtext/domain/editor/editor.types'

export type OpenCardtextEditorFromViewOptions = {
  returnTo?: CardtextEditReturnTo
}

/** CardtextView (или строка списка) → CardEditor + тулбар cardtextEditor. */
export function openCardtextEditorFromView(
  dispatch: AppDispatch,
  assetStatus: CardtextStatus,
  options?: OpenCardtextEditorFromViewOptions,
): void {
  dispatch(setCardtextEditReturnTo(options?.returnTo ?? 'view'))
  if (assetStatus === 'processed') {
    dispatch(toolbarAction({ section: 'cardtextView', key: 'edit' }))
    return
  }
  dispatch(setCardtextViewEditMode(true))
  dispatch(setDraftEngaged(true))
  dispatch(setDraftFocus(true))
}
