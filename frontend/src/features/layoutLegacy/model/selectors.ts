import { RootState } from '@app/store/store'

export const selectSizeCard = (state: RootState) =>
  state.layout.cardSize.sizeCard
export const selectSizeMiniCard = (state: RootState) =>
  state.layout.cardSize.sizeMiniCard
export const selectRemSize = (state: RootState) => state.layout.cardSize.remSize

export const selectHiPostImages = (state: RootState) =>
  state.layout.imageDb.hiPostImages
export const selectUserImages = (state: RootState) =>
  state.layout.imageDb.userImages

export const selectChoiceSection = (state: RootState) =>
  state.layout.section.choiceSection
export const selectSelectedSection = (state: RootState) =>
  state.layout.section.selectedSection
export const selectDeleteSection = (state: RootState) =>
  state.layout.section.deleteSection

export const selectToolbar = (state: RootState) => state.layout.toolbar

export const selectActiveSections = (state: RootState) =>
  state.layout.activeSections

export const selectMemoryCrop = (state: RootState) =>
  state.layout.memory.memoryCrop
export const selectChoiceMemorySection = (state: RootState) =>
  state.layout.memory.choiceMemorySection
export const selectExpendMemoryCard = (state: RootState) =>
  state.layout.memory.expendMemoryCard
export const selectLockExpendMemoryCard = (state: RootState) =>
  state.layout.memory.lockExpendMemoryCard

export const selectFullCard = (state: RootState) =>
  state.layout.cardState.fullCard
export const selectAddFullCard = (state: RootState) =>
  state.layout.cardState.addFullCard
export const selectSelectedCard = (state: RootState) =>
  state.layout.cardState.selectedCard
export const selectFullCardPersonalId = (state: RootState) =>
  state.layout.cardState.fullCardPersonalId
export const selectMaxCardsList = (state: RootState) =>
  state.layout.cardState.maxCardsList

export const selectSliderLetter = (state: RootState) =>
  state.layout.slider.sliderLetter
export const selectSliderLine = (state: RootState) =>
  state.layout.slider.sliderLine
export const selectDeltaEnd = (state: RootState) => state.layout.slider.deltaEnd

export const selectCartCards = (state: RootState) => state.layout.cart.cartCards
export const selectDateCartCards = (state: RootState) =>
  state.layout.cart.dateCartCards
export const selectLockDateCartCards = (state: RootState) =>
  state.layout.cart.lockDateCartCards

export const selectPersonalId = (state: RootState) =>
  state.layout.personal.personalId
export const selectCurrentDate = (state: RootState) =>
  state.layout.personal.currentDate
export const selectChoiceSave = (state: RootState) =>
  state.layout.personal.choiceSave
export const selectChoiceClip = (state: RootState) =>
  state.layout.personal.choiceClip
