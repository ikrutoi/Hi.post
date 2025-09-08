import { useAppDispatch } from '@app/hooks/useAppDispatch'
import { useAppSelector } from '@app/hooks/useAppSelector'
import { metaActions } from '../state/layoutActions'
import {
  selectFullCard,
  selectAddFullCard,
  selectMaxCardsList,
  selectSliderLetter,
  selectSliderLine,
  selectDeltaEnd,
  selectPersonalId,
  selectFullCardPersonalId,
  selectChoiceClip,
} from '../state/layoutSelectors'

export const useLayoutMetaFacade = () => {
  const dispatch = useAppDispatch()

  return {
    fullCard: useAppSelector(selectFullCard),
    addFullCard: useAppSelector(selectAddFullCard),
    maxCardsList: useAppSelector(selectMaxCardsList),
    sliderLetter: useAppSelector(selectSliderLetter),
    sliderLine: useAppSelector(selectSliderLine),
    deltaEnd: useAppSelector(selectDeltaEnd),
    personalId: useAppSelector(selectPersonalId),
    fullCardPersonalId: useAppSelector(selectFullCardPersonalId),
    choiceClip: useAppSelector(selectChoiceClip),
    setChoiceClip: (value: string | null) =>
      dispatch(metaActions.setChoiceClip(value)),
    setFullCard: (value: boolean) => dispatch(metaActions.setFullCard(value)),
    setAddFullCard: (value: boolean) =>
      dispatch(metaActions.setAddFullCard(value)),
    setMaxCardsList: (value: number | null) =>
      dispatch(metaActions.setMaxCardsList(value)),
    setSliderLetter: (value: string | null) =>
      dispatch(metaActions.setSliderLetter(value)),
    setSliderLine: (value: string | null) =>
      dispatch(metaActions.setSliderLine(value)),
    setDeltaEnd: (value: number | null) =>
      dispatch(metaActions.setDeltaEnd(value)),
    setPersonalId: (value: string | null) =>
      dispatch(metaActions.setPersonalId(value)),
    setFullCardPersonalId: (
      payload: Partial<{ cart: string; drafts: string }>
    ) => dispatch(metaActions.setFullCardPersonalId(payload)),
  }
}
