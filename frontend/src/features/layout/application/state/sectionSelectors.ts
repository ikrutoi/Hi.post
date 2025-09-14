import type { RootState } from '@app/state'

export const selectSelectedSection = (state: RootState) =>
  state.layout.section.selectedSection
export const selectChoiceSection = (state: RootState) =>
  state.layout.section.choiceSection
export const selectDeleteSection = (state: RootState) =>
  state.layout.section.deleteSection
export const selectActiveSections = (state: RootState) =>
  state.layout.section.activeSections
