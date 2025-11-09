import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  setCardphoto,
  setCardtext,
  setEnvelope,
  setAroma,
  setDate,
  setCardId,
  resetCardEditor,
} from '../../infrastructure/state'
import {
  selectCardEditor,
  selectCardEditorId,
  selectHasAnySectionCompleteCardEditor,
  selectIsCardEditorComplete,
  selectCompletedSectionsCardEditor,
  selectCompletionCardEditorMap,
  selectIncompleteSectionsCardEditor,
} from '../../infrastructure/selectors'
import type {
  CardphotoState,
  CardtextState,
  EnvelopeState,
  AromaItem,
  DispatchDate,
} from '../../domain/types'

export const useCardEditorFacade = () => {
  const dispatch = useAppDispatch()

  const cardEditor = useAppSelector(selectCardEditor)
  const cardId = useAppSelector(selectCardEditorId)
  const hasAnySectionComplete = useAppSelector(
    selectHasAnySectionCompleteCardEditor
  )
  const isCardComplete = useAppSelector(selectIsCardEditorComplete)
  const completedSections = useAppSelector(selectCompletedSectionsCardEditor)
  const completionMap = useAppSelector(selectCompletionCardEditorMap)
  const incompleteSections = useAppSelector(selectIncompleteSectionsCardEditor)

  return {
    state: {
      cardEditor,
      cardId,
      hasAnySectionComplete,
      isCardComplete,
      completedSections,
      completionMap,
      incompleteSections,
    },
    actions: {
      setCardphoto: (payload: CardphotoState) =>
        dispatch(setCardphoto(payload)),
      setCardtext: (payload: CardtextState) => dispatch(setCardtext(payload)),
      setEnvelope: (payload: EnvelopeState) => dispatch(setEnvelope(payload)),
      setAroma: (payload: AromaItem) => dispatch(setAroma(payload)),
      setDate: (payload: DispatchDate) => dispatch(setDate(payload)),
      setCardId: (payload: string) => dispatch(setCardId(payload)),
      resetCardEditor: () => dispatch(resetCardEditor()),
    },
  }
}
