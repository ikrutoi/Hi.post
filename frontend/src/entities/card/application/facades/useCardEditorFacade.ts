import { useCardEditorController } from '../controllers'
import {
  CARD_SECTIONS,
  type CardSaved,
  type CardSection,
} from '../../domain/types'

export const useCardEditorFacade = () => {
  const { state, actions } = useCardEditorController()

  const isAllComplete = state.incompleteSections.length === 0

  const isDateFilled =
    state.editor.date.isComplete && state.editor.date.data !== null

  const isDraftReady = isAllComplete && !isDateFilled
  const isFullReady = isAllComplete && isDateFilled

  const getFirstIncompleteSection = (): CardSection | null =>
    state.incompleteSections.length > 0 ? state.incompleteSections[0] : null

  const buildCardSaved = (): CardSaved | null => {
    if (!isAllComplete || !state.editor.id) return null

    return {
      id: state.editor.id,
      cardphoto: state.getSectionData('cardphoto')!,
      cardtext: state.getSectionData('cardtext')!,
      envelope: state.getSectionData('envelope')!,
      aroma: state.getSectionData('aroma')!,
      date: state.getSectionData('date')!,
    }
  }

  return {
    state,
    actions,
    computed: {
      isAllComplete,
      isDraftReady,
      isFullReady,
      isReadyToSave: isAllComplete,
      getFirstIncompleteSection,
      buildCardSaved,
    },
  }
}
