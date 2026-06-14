import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@app/state'
import type { PanelDensity2Size } from '@shared/ui/icons'

const selectCardphotoUi = (state: RootState) => state.cardphotoUi

export function cardphotoListDensityToGridCols(
  density: PanelDensity2Size,
): 4 | 5 {
  return density === 2 ? 5 : 4
}

export const selectShouldOpenFileDialog = createSelector(
  [selectCardphotoUi],
  (ui) => ui.shouldOpenFileDialog
)

export const selectIsLoading = createSelector(
  [selectCardphotoUi],
  (ui) => ui.isLoading
)

export const selectNeedsCrop = createSelector(
  [selectCardphotoUi],
  (ui) => ui.needsCrop
)

export const selectIsListPanelOpen = createSelector(
  [selectCardphotoUi],
  (ui) => ui.isListPanelOpen
)

export const selectCardphotoInlineTemplateListRevision = createSelector(
  [selectCardphotoUi],
  (ui) => ui.inlineTemplateListRevision
)

export const selectCardphotoListPanelDensity = createSelector(
  [selectCardphotoUi],
  (ui): PanelDensity2Size => ui.listPanelDensity ?? 1,
)

export const selectCardphotoListTemplateGridCols = createSelector(
  [selectCardphotoListPanelDensity],
  (density) => cardphotoListDensityToGridCols(density),
)

export const selectCardphotoListSortMode = createSelector(
  [selectCardphotoUi],
  (ui) => ui.listSortMode ?? 'dateDesc',
)

export const selectCardphotoListTitleCoverage = createSelector(
  [selectCardphotoUi],
  (ui) => ui.listTitleCoverage ?? 'none',
)

export const selectIsCardphotoViewEditMode = createSelector(
  [selectCardphotoUi],
  (ui) => ui.isCardphotoViewEditMode,
)

export const selectCardphotoViewReturnSnapshot = createSelector(
  [selectCardphotoUi],
  (ui) => ui.viewReturnSnapshot,
)
