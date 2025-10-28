import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectCardItem,
  selectCardId,
  selectHasAnySectionComplete,
  selectIsCardComplete,
  selectCompletedSection,
  selectCompletionMap,
  selectIncompleteSections,
} from '../../infrastructure/selectors'
import {
  setCardphoto,
  setCardtext,
  setEnvelope,
  setAroma,
  setDate,
  setCardId,
  resetCard,
} from '../../infrastructure/state'
import type {
  CardphotoState,
  CardtextState,
  EnvelopeState,
  AromaState,
  DispatchDate,
} from '../../domain/types'

export const useCardController = () => {
  const dispatch = useAppDispatch()

  const card = useAppSelector(selectCardItem)
  const cardId = useAppSelector(selectCardId)
  const hasAnySectionComplete = useAppSelector(selectHasAnySectionComplete)
  const isCardComplete = useAppSelector(selectIsCardComplete)
  const completedSections = useAppSelector(selectCompletedSection)
  const completionMap = useAppSelector(selectCompletionMap)
  const incompleteSections = useAppSelector(selectIncompleteSections)

  useEffect(() => {
    if (!cardId && hasAnySectionComplete) {
      dispatch(setCardId(uuidv4()))
    }
  }, [cardId, hasAnySectionComplete, dispatch])

  const updateCardphoto = (data: CardphotoState) => dispatch(setCardphoto(data))
  const updateCardtext = (data: CardtextState) => dispatch(setCardtext(data))
  const updateEnvelope = (data: EnvelopeState) => dispatch(setEnvelope(data))
  const updateAroma = (data: AromaState) => dispatch(setAroma(data))
  const updateDate = (data: DispatchDate) => dispatch(setDate(data))

  const updateCardId = (id: string) => dispatch(setCardId(id))
  const clearCard = () => dispatch(resetCard())

  return {
    state: {
      card,
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
      clearCard,
    },
  }
}
