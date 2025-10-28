import type { RootState } from '@app/state'

export const selectActiveSection = (state: RootState) =>
  state.layout.section.activeSection
// export const selectSelectedSection = (state: RootState) =>
//   state.layout.section.selectedSection
export const selectDeleteSection = (state: RootState) =>
  state.layout.section.deleteSection
export const selectChoiceSection = (state: RootState) =>
  state.layout.section.choiceSection
export const selectChoiceMemorySection = (state: RootState) =>
  state.layout.section.choiceMemorySection
export const selectButtonToolbar = (state: RootState) =>
  state.layout.section.buttonToolbar
export const selectChoiceSave = (state: RootState) =>
  state.layout.section.choiceSave
// export const getChoiceClip = (state: RootState) =>
//   state.layout.section.choiceClip
