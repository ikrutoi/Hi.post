import { useAppDispatch } from '@app/hooks/useAppDispatch'
import { useAppSelector } from '@app/hooks/useAppSelector'
import { layoutActions } from '../state/layout/layoutSlice'
import type { ActiveSections } from '../../domain/model/layoutTypes'
import * as layoutSelectors from '../state/layout/layoutSelectors'

export const useLayoutFacade = () => {
  const dispatch = useAppDispatch()

  return {
    size: {
      sizeCard: useAppSelector(layoutSelectors.selectSizeCard),
      sizeMiniCard: useAppSelector(layoutSelectors.selectSizeMiniCard),
      remSize: useAppSelector(layoutSelectors.selectRemSize),
      setSizeCard: (payload: Partial<{ width: number; height: number }>) =>
        dispatch(layoutActions.addSizeCard(payload)),
      setSizeMiniCard: (payload: Partial<{ width: number; height: number }>) =>
        dispatch(layoutActions.addSizeMiniCard(payload)),
      setRemSize: (value: number | null) =>
        dispatch(layoutActions.addRemSize(value)),
    },

    section: {
      selected: useAppSelector(layoutSelectors.selectSelectedSection),
      choice: useAppSelector(layoutSelectors.selectChoiceSection),
      deleted: useAppSelector(layoutSelectors.selectDeleteSection),
      setSelected: (section: string | null) =>
        dispatch(layoutActions.setSelectedSection(section)),
      setChoice: (section: Partial<{ source: string; nameSection: string }>) =>
        dispatch(layoutActions.addChoiceSection(section)),
      setDeleted: (section: string | null) =>
        dispatch(layoutActions.setDeleteSection(section)),
    },

    memory: {
      expendCard: useAppSelector(layoutSelectors.selectExpendMemoryCard),
      lockExpendCard: useAppSelector(
        layoutSelectors.selectLockExpendMemoryCard
      ),
      cartCards: useAppSelector(layoutSelectors.selectCartCards),
      dateCartCards: useAppSelector(layoutSelectors.selectDateCartCards),
      lockDateCartCards: useAppSelector(
        layoutSelectors.selectLockDateCartCards
      ),
      setExpendCard: (payload: any) =>
        dispatch(layoutActions.setExpendMemoryCard(payload)),
      setLockExpendCard: (value: boolean) =>
        dispatch(layoutActions.setLockExpendMemoryCard(value)),
      setCartCards: (payload: any) =>
        dispatch(layoutActions.setCartCards(payload)),
      setDateCartCards: (payload: any) =>
        dispatch(layoutActions.setDateCartCards(payload)),
      setLockDateCartCards: (value: boolean) =>
        dispatch(layoutActions.setLockDateCartCards(value)),
    },

    meta: {
      fullCard: useAppSelector(layoutSelectors.selectFullCard),
      addFullCard: useAppSelector(layoutSelectors.selectAddFullCard),
      maxCardsList: useAppSelector(layoutSelectors.selectMaxCardsList),
      sliderLetter: useAppSelector(layoutSelectors.selectSliderLetter),
      sliderLine: useAppSelector(layoutSelectors.selectSliderLine),
      deltaEnd: useAppSelector(layoutSelectors.selectDeltaEnd),
      personalId: useAppSelector(layoutSelectors.selectPersonalId),
      fullCardPersonalId: useAppSelector(
        layoutSelectors.selectFullCardPersonalId
      ),
      setFullCard: (value: boolean) =>
        dispatch(layoutActions.setFullCard(value)),
      setAddFullCard: (value: boolean) =>
        dispatch(layoutActions.setAddFullCard(value)),
      setMaxCardsList: (value: number | null) =>
        dispatch(layoutActions.setMaxCardsList(value)),
      setSliderLetter: (value: string | null) =>
        dispatch(layoutActions.setSliderLetter(value)),
      setSliderLine: (value: string | null) =>
        dispatch(layoutActions.setSliderLine(value)),
      setDeltaEnd: (value: number | null) =>
        dispatch(layoutActions.setDeltaEnd(value)),
      setPersonalId: (value: string | null) =>
        dispatch(layoutActions.setPersonalId(value)),
      setFullCardPersonalId: (
        payload: Partial<{ cart: string; drafts: string }>
      ) => dispatch(layoutActions.setFullCardPersonalId(payload)),
    },

    toolbar: {
      btnToolbar: useAppSelector(layoutSelectors.selectBtnToolbar),
      setBtnToolbar: (
        payload: Partial<{
          firstBtn: string
          secondBtn: string
          section: string
        }>
      ) => dispatch(layoutActions.setBtnToolbar(payload)),
    },

    active: {
      sections: useAppSelector(layoutSelectors.selectActiveSections),
      setActiveSections: (payload: Partial<ActiveSections>) =>
        dispatch(layoutActions.setActiveSections(payload)),
    },
  }
}
