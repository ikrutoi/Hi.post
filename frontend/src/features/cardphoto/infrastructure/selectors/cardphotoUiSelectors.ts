import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@app/state'

const selectCardphotoUi = (state: RootState) => state.cardphotoUi

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
