import { useCardEditorController } from '../controllers/useCardEditorController'
import { CARD_SECTIONS } from '@shared/config/constants'

export const useCardEditorFacade = () => {
  const { state, actions } = useCardEditorController()

  return {
    state: {
      editorState: state.editorState,
      editorId: state.editorId,
      isCompleted: state.isCompleted,
    },
    layout: {
      sections: CARD_SECTIONS,
    },
    actions: {
      removeSection: actions.removeSection,
      reset: actions.reset,
    },
  }
}
