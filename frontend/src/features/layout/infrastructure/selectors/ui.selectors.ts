import type { RootState } from '@app/state'

export const getIsLoading = (state: RootState) => state.layout.ui.isLoading
export const getError = (state: RootState) => state.layout.ui.error
export const getButtonsVisibility = (state: RootState) =>
  state.layout.ui.buttonsVisible
export const getButtonsLock = (state: RootState) =>
  state.layout.ui.buttonsLocked
export const getTheme = (state: RootState) => state.layout.ui.theme
export const getLayoutMode = (state: RootState) => state.layout.ui.layoutMode
