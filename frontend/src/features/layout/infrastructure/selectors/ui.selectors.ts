import { RootState } from '@app/state'

export const selectUiState = (state: RootState) => state.layout.ui
export const selectIsLoading = (state: RootState) => state.layout.ui.isLoading
export const selectError = (state: RootState) => state.layout.ui.error
export const selectButtonsVisible = (state: RootState) =>
  state.layout.ui.buttonsVisible
export const selectButtonsLocked = (state: RootState) =>
  state.layout.ui.buttonsLocked
export const selectTheme = (state: RootState) => state.layout.ui.theme
export const selectLayoutMode = (state: RootState) => state.layout.ui.layoutMode
export const selectSelectedTemplate = (state: RootState) =>
  state.layout.ui.selectedTemplate
export const selectTemplateState = (state: RootState) =>
  state.layout.ui.templateState
export const selectSelectedSection = (state: RootState) =>
  state.layout.ui.selectedSection
