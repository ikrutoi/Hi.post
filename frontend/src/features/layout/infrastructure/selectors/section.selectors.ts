import type { RootState } from '@app/state'

export const getActiveSection = (state: RootState) =>
  state.layout.section.activeSection
export const getSelectedSection = (state: RootState) =>
  state.layout.section.selectedSection
export const getDeleteSection = (state: RootState) =>
  state.layout.section.deleteSection
export const getChoiceSection = (state: RootState) =>
  state.layout.section.choiceSection
export const getChoiceMemorySection = (state: RootState) =>
  state.layout.section.choiceMemorySection
export const getButtonToolbar = (state: RootState) =>
  state.layout.section.buttonToolbar
export const getChoiceSave = (state: RootState) =>
  state.layout.section.choiceSave
// export const getChoiceClip = (state: RootState) =>
//   state.layout.section.choiceClip
