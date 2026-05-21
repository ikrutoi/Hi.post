import type { AppDispatch } from '@app/state'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  setCardtextViewEditMode,
  setDraftEngaged,
  setDraftFocus,
} from '@cardtext/infrastructure/state'
import type { CardtextStatus } from '@cardtext/domain/editor/editor.types'

/** CardtextView (или строка списка) → CardEditor + тулбар cardtextEditor. */
export function openCardtextEditorFromView(
  dispatch: AppDispatch,
  assetStatus: CardtextStatus,
): void {
  if (assetStatus === 'processed') {
    dispatch(toolbarAction({ section: 'cardtextProcessed', key: 'edit' }))
    return
  }
  dispatch(setCardtextViewEditMode(true))
  dispatch(setDraftEngaged(true))
  dispatch(setDraftFocus(true))
}
