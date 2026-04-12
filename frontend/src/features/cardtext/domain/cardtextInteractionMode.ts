import type { CardtextStatus } from './editor/editor.types'

export type CardtextInteractionMode =
  | 'processedSlot'
  | 'postcardTemplateView'
  | 'createEmpty'
  | 'editFromPostcardView'
  | 'editTemplate'

export type DeriveCardtextInteractionModeInput = {
  cardtextAssetStatus: CardtextStatus
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
