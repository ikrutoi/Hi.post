import type { RootState } from '@app/state'

export const selectFullCard = (state: RootState) => state.layout.meta.fullCard
export const selectAddFullCard = (state: RootState) =>
  state.layout.meta.addFullCard
export const selectSelectedCard = (state: RootState) =>
  state.layout.meta.selectedCard
export const selectMaxCardsList = (state: RootState) =>
  state.layout.meta.maxCardsList
export const selectSliderLetter = (state: RootState) =>
  state.layout.meta.sliderLetter
export const selectSliderLine = (state: RootState) =>
  state.layout.meta.sliderLine
export const selectDeltaEnd = (state: RootState) => state.layout.meta.deltaEnd
export const selectPersonalId = (state: RootState) =>
  state.layout.meta.personalId
export const selectFullCardPersonalId = (state: RootState) =>
  state.layout.meta.fullCardPersonalId
export const selectCurrentDate = (state: RootState) =>
  state.layout.meta.currentDate
export const selectCartCards = (state: RootState) => state.layout.meta.cartCards
export const selectDateCartCards = (state: RootState) =>
  state.layout.meta.dateCartCards
export const selectLockDateCartCards = (state: RootState) =>
  state.layout.meta.lockDateCartCards
export const selectChoiceClip = (state: RootState) =>
  state.layout.meta.choiceClip
