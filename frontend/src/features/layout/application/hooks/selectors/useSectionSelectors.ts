import { useStore } from 'react-redux'
import type { RootState } from '@app/state'

export const useSectionSelectors = () => {
  const state = useStore<RootState>().getState().layout.section

  return {
    getActiveSection: () => state.activeSection,
    getSelectedSection: () => state.selectedSection,
    getDeleteSection: () => state.deleteSection,
    getChoiceSection: () => state.choiceSection,
    getChoiceMemorySection: () => state.choiceMemorySection,
    getButtonToolbar: () => state.buttonToolbar,
    getChoiceSave: () => state.choiceSave,
    // getChoiceClip: () => state.choiceClip,
  }
}
