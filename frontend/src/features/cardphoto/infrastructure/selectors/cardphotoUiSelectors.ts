import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@app/state'
import type { PanelDensity2Size } from '@shared/ui/icons'
import {
  selectCardphotoAppliedData,
  selectCardphotoAssetData,
} from './cardphotoSelectors'

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

/**
 * Активная сессия create/crop: новый оригинал, edit из View, или reopen original.
 * Applied original без этих флагов — обычная секция cardphoto / peek, не chrome кропа.
 */
export const selectIsCardphotoCreateSession = createSelector(
  [
    selectCardphotoAssetData,
    selectCardphotoAppliedData,
    selectIsCardphotoViewEditMode,
    selectCardphotoViewReturnSnapshot,
  ],
  (asset, applied, viewEdit, snapshot): boolean => {
    if (viewEdit || snapshot != null) return true
    if (asset?.source !== 'original') return false
    const appliedMatch =
      !!asset.id && !!applied?.id && asset.id === applied.id
    return !appliedMatch
  },
)

export const selectListCardphotoBadgePulseSeq = createSelector(
  [selectCardphotoUi],
  (ui) => ui.listCardphotoBadgePulseSeq ?? 0,
)

export const selectListCardphotoBadgePulsing = createSelector(
  [selectCardphotoUi],
  (ui) => Boolean(ui.listCardphotoBadgePulsing),
)
