import type { CardtextState, CardtextValue } from '@cardtext/domain/editor/editor.types'
import {
  deriveCardtextInteractionMode,
  type CardtextInteractionMode,
  type DeriveCardtextInteractionModeInput,
} from '@cardtext/domain/cardtextInteractionMode'
import { isEmptyCardtextValue } from '@cardtext/domain/helpers'
import type { ToolbarSection } from '@toolbar/domain/types'

export function cardtextToolbarSectionFromMode(
  mode: CardtextInteractionMode,
): ToolbarSection {
  switch (mode) {
    case 'processedSlot':
      return 'cardtextProcessed'
    case 'postcardTemplateView':
      return 'cardtextView'
    case 'createEmpty':
    case 'editFromPostcardView':
      return 'cardtextCreate'
    case 'editTemplate':
      return 'cardtextEditor'
    default: {
      const _exhaustive: never = mode
      return _exhaustive
    }
  }
}

export function resolveCardtextInteractionMode(
  input: DeriveCardtextInteractionModeInput,
): CardtextInteractionMode {
  return deriveCardtextInteractionMode(input)
}

export function resolveCardtextToolbarSection(
  input: DeriveCardtextInteractionModeInput,
): ToolbarSection {
  return cardtextToolbarSectionFromMode(deriveCardtextInteractionMode(input))
}

/**
 * Пустая строка создания: не показываем тулбар, пока пользователь не «вовлёк» редактор
 * или не появился материализованный пустой asset.
 */
export function shouldHideEmptyCreateToolbar(input: {
  currentView: 'draft' | 'view'
  currentTemplateId: string | null
  value: CardtextValue
  isAddTemplateOpen: boolean
  cardtext: Pick<CardtextState, 'assetData' | 'isDraftEngaged'>
}): boolean {
  const {
    currentView,
    currentTemplateId,
    value,
    isAddTemplateOpen,
    cardtext,
  } = input
  return (
    currentView === 'draft' &&
    currentTemplateId == null &&
    isEmptyCardtextValue(value) &&
    !isAddTemplateOpen &&
    (cardtext.assetData != null || !cardtext.isDraftEngaged)
  )
}
