import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@app/state'
import { isCardtextInQuickList } from '../../domain/helpers/cardtextQuickListMatch'
import type { CardtextContent } from '../../domain/editor/editor.types'
import type { PanelDensity2Size } from '@shared/ui/icons'
import { selectCardtextId, selectCardtextPlainText } from './cardtextEditorSelectors'

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
