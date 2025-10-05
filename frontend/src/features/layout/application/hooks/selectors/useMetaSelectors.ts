import { useStore } from 'react-redux'
import type { RootState } from '@app/state'

export const useMetaSelectors = () => {
  const state = useStore<RootState>().getState().layout.meta

  return {
    getFullCard: () => state.fullCard,
    getAddFullCard: () => state.addFullCard,
    getSelectedCard: () => state.selectedCard,
    getMaxCardsList: () => state.maxCardsList ?? 1,
    getSliderLetter: () => state.sliderLetter,
    getSliderLetterPayload: () => state.sliderLetterPayload,
    getSliderLine: () => state.sliderLine,
    getDeltaEnd: () => state.deltaEnd ?? 0,
    getPersonalId: () => state.personalId,
    getFullCardPersonalId: () => state.fullCardPersonalId,
    getCurrentDate: () => state.currentDate,
    getCartCards: () => state.cartCards,
    getDateCartCards: () => state.dateCartCards,
    getLockDateCartCards: () => state.lockDateCartCards,
    getChoiceClip: () => state.choiceClip,
  }
}
