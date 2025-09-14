import type { RootState } from '@app/state'

export const selectBtnToolbar = (state: RootState) =>
  state.layout.toolbar.btnToolbar
export const selectChoiceSave = (state: RootState) =>
  state.layout.toolbar.choiceSave
export const selectToolbarChoiceClip = (state: RootState) =>
  state.layout.toolbar.choiceClip
