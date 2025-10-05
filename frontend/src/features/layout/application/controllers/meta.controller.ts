import { AppDispatch } from '@app/state'
import {
  setFullCard,
  setAddFullCard,
  setSelectedCard,
  setMaxCardsList,
  setSliderLetter,
  setSliderLetterPayload,
  setSliderLine,
  setDeltaEnd,
  setPersonalId,
  setFullCardPersonalId,
  setCurrentDate,
  setCartCards,
  setDateCartCards,
  setLockDateCartCards,
  setChoiceClip,
} from '../../infrastructure/state/meta.slice'

import type {
  FullCardPersonalId,
  SliderLetterPayload,
  CartCardsPayload,
} from '../../domain/types'

export const metaController = (dispatch: AppDispatch) => ({
  setFullCard: (value: boolean) => dispatch(setFullCard(value)),
  setAddFullCard: (value: boolean) => dispatch(setAddFullCard(value)),
  setSelectedCard: (value: boolean) => dispatch(setSelectedCard(value)),
  setMaxCardsList: (value: number | null) => dispatch(setMaxCardsList(value)),
  setSliderLetter: (value: SliderLetterPayload | null) =>
    dispatch(setSliderLetter(value)),
  setSliderLetterPayload: (value: SliderLetterPayload | null) =>
    dispatch(setSliderLetterPayload(value)),
  setSliderLine: (value: string | null) => dispatch(setSliderLine(value)),
  setDeltaEnd: (value: number | null) => dispatch(setDeltaEnd(value)),
  setPersonalId: (value: string | null) => dispatch(setPersonalId(value)),
  setFullCardPersonalId: (payload: Partial<FullCardPersonalId>) =>
    dispatch(setFullCardPersonalId(payload)),
  setCurrentDate: (value: string | null) => dispatch(setCurrentDate(value)),
  setCartCards: (payload: CartCardsPayload | null) =>
    dispatch(setCartCards(payload)),
  setDateCartCards: (value: string | null) => dispatch(setDateCartCards(value)),
  setLockDateCartCards: (value: boolean | null) =>
    dispatch(setLockDateCartCards(value)),
  setChoiceClip: (value: string | null) => dispatch(setChoiceClip(value)),
})
