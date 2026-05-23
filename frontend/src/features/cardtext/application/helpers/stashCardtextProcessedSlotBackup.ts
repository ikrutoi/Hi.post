import type { AppDispatch } from '@app/state'
import type { CardtextContent } from '@cardtext/domain/editor/editor.types'
import { setCardtextProcessedSlotBackup } from '@cardtext/infrastructure/state'

/** Перед открытием шаблона в View — запомнить Processed, чтобы Close в View мог вернуть слот. */
export function stashCardtextProcessedSlotBackup(
  dispatch: AppDispatch,
  assetData: CardtextContent | null | undefined,
): void {
  if (assetData?.status === 'processed') {
    dispatch(setCardtextProcessedSlotBackup(assetData))
  }
}
