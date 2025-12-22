import { RootState } from '@app/state'

export const selectActiveSection = (state: RootState) =>
  state.sectionEditorMenu.activeSection
