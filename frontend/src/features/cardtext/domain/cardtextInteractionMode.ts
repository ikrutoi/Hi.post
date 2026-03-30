import type { CardtextStatus } from './editor/editor.types'

/**
 * Единый «смысловой» режим cardtext для UI и саг (вместо связки из нескольких флагов).
 *
 * Золотая таблица (при неизменных правилах derive):
 *
 * | processed в asset        | processedSlot
 * | view + inLine/outLine + view-edit | editFromPostcardView
 * | draft + нет id шаблона | createEmpty
 * | view (остальное)       | postcardTemplateView
 * | иначе (черновик с id)  | editTemplate
 *
 * Отображение в ToolbarSection задаётся в `cardtextToolbarSectionFromMode` (application/helpers).
 */
export type CardtextInteractionMode =
  | 'processedSlot'
  | 'postcardTemplateView'
  | 'createEmpty'
  | 'editFromPostcardView'
  | 'editTemplate'

export type DeriveCardtextInteractionModeInput = {
  cardtextAssetStatus: CardtextStatus
  /** draft: редактор / создание; view: просмотр на открытке */
  currentView: 'draft' | 'view'
  currentTemplateId: string | null
  isCardtextViewEditMode?: boolean
}

export function deriveCardtextInteractionMode(
  input: DeriveCardtextInteractionModeInput,
): CardtextInteractionMode {
  const {
    cardtextAssetStatus,
    currentView,
    currentTemplateId,
    isCardtextViewEditMode,
  } = input

  if (cardtextAssetStatus === 'processed') return 'processedSlot'

  if (
    isCardtextViewEditMode === true &&
    (cardtextAssetStatus === 'inLine' || cardtextAssetStatus === 'outLine')
  ) {
    return 'editFromPostcardView'
  }

  if (currentView === 'draft' && currentTemplateId == null) return 'createEmpty'

  if (currentView === 'view') return 'postcardTemplateView'

  return 'editTemplate'
}
