import type { RootState } from '@app/store/store'

export const selectCardtext = (state: RootState) =>
  state.cardEditor.cardtext.value
export const selectFontSize = (state: RootState) =>
  state.cardEditor.cardtext.value.fontSize
export const selectFont = (state: RootState) =>
  state.cardEditor.cardtext.value.font
export const selectTextAlign = (state: RootState) =>
  state.cardEditor.cardtext.value.textAlign
