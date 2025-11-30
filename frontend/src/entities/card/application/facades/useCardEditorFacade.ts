import { useCardEditorController } from '../controllers'
import {
  type Card,
  type CardSection,
  type CardEditorDataMap,
  type CardStatus,
} from '../../domain/types'
import { isCardValidForStatus } from '../../domain/helpers'

export const useCardEditorFacade = () => {
  const { state, actions } = useCardEditorController()

  const isAllComplete = state.incompleteSections.length === 0

  const getFirstIncompleteSection = (): CardSection | null =>
    state.incompleteSections.length > 0 ? state.incompleteSections[0] : null

  const buildCardSaved = (): Card | null => {
    if (!isAllComplete || !state.editor.id) return null

    const cardphoto = state.getSectionData(
      'cardphoto'
    ) as CardEditorDataMap['cardphoto']
    const cardtext = state.getSectionData(
      'cardtext'
    ) as CardEditorDataMap['cardtext']
    const envelope = state.getSectionData(
      'envelope'
    ) as CardEditorDataMap['envelope']
    const aroma = state.getSectionData('aroma') as CardEditorDataMap['aroma']
    const date = state.getSectionData('date') as CardEditorDataMap['date']

    return {
      id: state.editor.id,
      status: state.status,
      cardphoto: { isComplete: true, data: cardphoto },
      cardtext: { isComplete: true, data: cardtext },
      envelope: { isComplete: true, data: envelope },
      aroma: { isComplete: true, data: aroma },
      date: { isComplete: true, data: date },
    }
  }

  return {
    state,
    actions,
    computed: {
      isAllComplete,
      getFirstIncompleteSection,
      buildCardSaved,
      currentStatus: state.status as CardStatus,
      isValidForDrafts: isCardValidForStatus(state.editor, 'drafts'),
      isValidForSaved: isCardValidForStatus(state.editor, 'saved'),
      isValidForTrash: isCardValidForStatus(state.editor, 'trash'),
      isValidInProgress: isCardValidForStatus(state.editor, 'inProgress'),
    },
  }
}
