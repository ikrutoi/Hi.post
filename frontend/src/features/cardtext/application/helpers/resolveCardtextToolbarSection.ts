import type {
  CardtextState,
  CardtextStatus,
  CardtextValue,
} from '@cardtext/domain/editor/editor.types'
import { isEmptyCardtextValue } from '@cardtext/domain/helpers'
import type { ToolbarSection } from '@toolbar/domain/types'

export function resolveCardtextToolbarSection(input: {
  cardtextAssetStatus: CardtextStatus
  currentView: 'draft' | 'view'
  currentTemplateId: string | null
  isCardtextViewEditMode?: boolean
}): ToolbarSection {
  const {
    cardtextAssetStatus,
    currentView,
    currentTemplateId,
    isCardtextViewEditMode,
  } = input
  if (cardtextAssetStatus === 'processed') return 'cardtextProcessed'
  if (
    isCardtextViewEditMode === true &&
    (cardtextAssetStatus === 'inLine' || cardtextAssetStatus === 'outLine')
  ) {
    return 'cardtextCreate'
  }
  if (currentView === 'draft' && currentTemplateId == null)
    return 'cardtextCreate'
  if (currentView === 'view') return 'cardtextView'
  return 'cardtextEditor'
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
  cardtext: Pick<CardtextState, 'assetData' | 'isCardtextDraftEngaged'>
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
    (cardtext.assetData != null || !cardtext.isCardtextDraftEngaged)
  )
}
