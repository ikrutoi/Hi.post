import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectCardEditor,
  selectCardEditorId,
  selectHasAnySectionCompleteCardEditor,
  selectIsCardEditorComplete,
  selectCompletedSectionsCardEditor,
  selectCompletionCardEditorMap,
  selectIncompleteSectionsCardEditor,
} from '../../infrastructure/selectors'
import {
  setCardphoto,
  setCardtext,
  setEnvelope,
  setAroma,
  setDate,
  setCardId,
  resetCardEditor,
} from '../../infrastructure/state'
import type {
  CardphotoState,
  CardtextState,
  EnvelopeState,
  AromaItem,
  DispatchDate,
} from '../../domain/types'

export const useCardEditorController = () => {
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

  useEffect(() => {
    if (!cardId && hasAnySectionComplete) {
      dispatch(setCardId(uuidv4()))
    }
  }, [cardId, hasAnySectionComplete, dispatch])

  const updateCardphoto = (data: CardphotoState) => dispatch(setCardphoto(data))
  const updateCardtext = (data: CardtextState) => dispatch(setCardtext(data))
  const updateEnvelope = (data: EnvelopeState) => dispatch(setEnvelope(data))
  const updateAroma = (data: AromaItem) => dispatch(setAroma(data))
  const updateDate = (data: DispatchDate) => dispatch(setDate(data))

  const updateCardId = (id: string) => dispatch(setCardId(id))
  const clearCardEditor = () => dispatch(resetCardEditor())

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
      updateCardphoto,
      updateCardtext,
      updateEnvelope,
      updateAroma,
      updateDate,
      updateCardId,
      clearCardEditor,
    },
  }
}
