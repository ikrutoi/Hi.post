import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@app/state'
import { getCardtextTemplateDisplayTitle } from '../../application/helpers/suggestCardtextTemplateTitle'
import { isCardtextInQuickList } from '../../domain/helpers/cardtextQuickListMatch'
import type { CardtextContent } from '../../domain/editor/editor.types'
import type { PanelDensity2Size } from '@shared/ui/icons'
import {
  selectCardtextId,
  selectCardtextPlainText,
  selectCardtextSessionData,
} from './cardtextEditorSelectors'

function findCardtextTemplateInList(
  templates: CardtextContent[] | null,
  templateId: string,
): CardtextContent | null {
  return (
    templates?.find(
      (item) => item.id != null && String(item.id) === String(templateId),
    ) ?? null
  )
}

export const selectIsCardtextListPanelOpen = (state: RootState): boolean =>
  state.cardtext.isListPanelOpen === true

export const selectCardtextAddTemplateOpen = (state: RootState): boolean =>
  state.cardtext.isAddTemplateOpen ?? false

export const selectCardtextEditTitleOpen = (state: RootState): boolean =>
  state.cardtext.isEditTitleOpen ?? false

export const selectCardtextListSortDirection = (
  state: RootState,
): 'asc' | 'desc' => state.cardtext.cardtextListSortDirection ?? 'asc'

export const selectCardtextListPanelDensity = (
  state: RootState,
): PanelDensity2Size => state.cardtext.cardtextListPanelDensity ?? 1

export const selectCardtextTemplatesListItems = (
  state: RootState,
): CardtextContent[] | null => state.cardtext.templatesList ?? null

export const selectCardtextTemplatesListLoading = (state: RootState): boolean =>
  state.cardtext.templatesListLoading === true

/** cardtextView: текст сессии совпадает с шаблоном в панели списка (inLine). */
export const selectCardtextViewInQuickList = createSelector(
  [selectCardtextPlainText, selectCardtextTemplatesListItems, selectCardtextId],
  (plainText, templates, assetId): boolean =>
    isCardtextInQuickList(plainText, templates, assetId),
)

/** cardtextView: текущий шаблон в списке (inLine) или выбранный в открытой панели. */
export const selectCardtextListHighlightTemplateId = createSelector(
  [
    selectCardtextViewInQuickList,
    selectCardtextId,
    (state: RootState) => state.cardtext.templatesListSelectedId,
  ],
  (inQuickList, assetId, listSelectedId): string | null => {
    if (inQuickList && assetId != null) return String(assetId)
    if (listSelectedId != null) return String(listSelectedId)
    return null
  },
)

/** Mobile factory: заголовок выбранного шаблона в верхнем toolbar при открытом списке. */
export const selectCardtextListCentralTemplateTitle = createSelector(
  [
    selectCardtextListHighlightTemplateId,
    selectCardtextTemplatesListItems,
    selectCardtextSessionData,
  ],
  (highlightId, templates, session): string | null => {
    if (highlightId == null) return null

    const fromList = findCardtextTemplateInList(templates, highlightId)
    if (fromList != null) {
      const title = getCardtextTemplateDisplayTitle(fromList)
      return title === '?' ? null : title
    }

    if (session.id != null && String(session.id) === String(highlightId)) {
      const title = getCardtextTemplateDisplayTitle(session)
      return title === '?' ? null : title
    }

    return null
  },
)
