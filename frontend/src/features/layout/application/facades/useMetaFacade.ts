import { useAppDispatch, useAppSelector } from '@app/hooks'
import type { DispatchDate } from '@entities/date/domain/types'
// import type {} from

import {
  selectFullCard,
  selectAddFullCard,
  selectSelectedCard,
  selectMaxCardsList,
  selectSliderLetter,
  selectSliderLetterPayload,
  selectSliderLine,
  selectDeltaEnd,
  selectPersonalId,
  selectFullCardPersonalId,
  selectCurrentDate,
  selectCartCards,
  selectDateCartCards,
  selectLockDateCartCards,
  selectChoiceClip,
} from '../../infrastructure/selectors/meta.selectors'
import {
  setFullCard,
  setAddFullCard,
  setSelectedCard,
  setMaxMiniCardsCount,
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
  SliderLetter,
  SliderLetterPayload,
  FullCardPersonalId,
  CartCardsPayload,
} from '../../domain/types'

export const useMetaFacade = () => {
  const dispatch = useAppDispatch()

  const fullCard = useAppSelector(selectFullCard)
  const addFullCard = useAppSelector(selectAddFullCard)
  const selectedCard = useAppSelector(selectSelectedCard)
  const maxMiniCardsCount = useAppSelector(selectMaxCardsList)
  const sliderLetter = useAppSelector(selectSliderLetter)
  const sliderLetterPayload = useAppSelector(selectSliderLetterPayload)
  const sliderLine = useAppSelector(selectSliderLine)
  const deltaEnd = useAppSelector(selectDeltaEnd)
  const personalId = useAppSelector(selectPersonalId)
  const fullCardPersonalId = useAppSelector(selectFullCardPersonalId)
  const currentDate = useAppSelector(selectCurrentDate)
  const cartCards = useAppSelector(selectCartCards)
  const dateCartCards = useAppSelector(selectDateCartCards)
  const lockDateCartCards = useAppSelector(selectLockDateCartCards)
  const choiceClip = useAppSelector(selectChoiceClip)

  return {
    meta: {
      fullCard,
      addFullCard,
      selectedCard,
      maxMiniCardsCount,
      sliderLetter,
      sliderLetterPayload,
      sliderLine,
      deltaEnd,
      personalId,
      fullCardPersonalId,
      currentDate,
      cartCards,
      dateCartCards,
      lockDateCartCards,
      choiceClip,
    },
    actions: {
      setFullCard: (value: boolean) => dispatch(setFullCard(value)),
      setAddFullCard: (value: boolean) => dispatch(setAddFullCard(value)),
      setSelectedCard: (value: boolean) => dispatch(setSelectedCard(value)),
      setMaxMiniCardsCount: (value: number | null) =>
        dispatch(setMaxMiniCardsCount(value)),
      setSliderLetter: (value: SliderLetter | null) =>
        dispatch(setSliderLetter(value)),
      setSliderLetterPayload: (value: SliderLetterPayload | null) =>
        dispatch(setSliderLetterPayload(value)),
      setSliderLine: (value: number | null) => dispatch(setSliderLine(value)),
      setDeltaEnd: (value: number | null) => dispatch(setDeltaEnd(value)),
      setPersonalId: (value: string | null) => dispatch(setPersonalId(value)),
      setFullCardPersonalId: (value: Partial<FullCardPersonalId>) =>
        dispatch(setFullCardPersonalId(value)),
      setCurrentDate: (value: string | null) => dispatch(setCurrentDate(value)),
      setCartCards: (value: CartCardsPayload | null) =>
        dispatch(setCartCards(value)),
      setDateCartCards: (value: DispatchDate | null) =>
        dispatch(setDateCartCards(value)),
      setLockDateCartCards: (value: boolean | null) =>
        dispatch(setLockDateCartCards(value)),
      setChoiceClip: (value: boolean) => dispatch(setChoiceClip(value)),
    },
  }
}
