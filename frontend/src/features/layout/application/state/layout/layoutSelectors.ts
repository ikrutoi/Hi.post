import type { RootState } from '@app/store/store'

// Size
export const selectSizeCard = (state: RootState) => state.layout.sizeCard
export const selectSizeMiniCard = (state: RootState) =>
  state.layout.sizeMiniCard
export const selectRemSize = (state: RootState) => state.layout.remSize

// Section
export const selectSelectedSection = (state: RootState) =>
  state.layout.selectedSection
export const selectChoiceSection = (state: RootState) =>
  state.layout.choiceSection
export const selectDeleteSection = (state: RootState) =>
  state.layout.deleteSection

// Toolbar
export const selectBtnToolbar = (state: RootState) => state.layout.btnToolbar

// Memory
export const selectExpendMemoryCard = (state: RootState) =>
  state.layout.expendMemoryCard
export const selectLockExpendMemoryCard = (state: RootState) =>
  state.layout.lockExpendMemoryCard
export const selectCartCards = (state: RootState) => state.layout.cartCards
export const selectDateCartCards = (state: RootState) =>
  state.layout.dateCartCards
export const selectLockDateCartCards = (state: RootState) =>
  state.layout.lockDateCartCards

// Meta
export const selectFullCard = (state: RootState) => state.layout.fullCard
export const selectAddFullCard = (state: RootState) => state.layout.addFullCard
export const selectMaxCardsList = (state: RootState) =>
  state.layout.maxCardsList
export const selectSliderLetter = (state: RootState) =>
  state.layout.sliderLetter
export const selectSliderLine = (state: RootState) => state.layout.sliderLine
export const selectDeltaEnd = (state: RootState) => state.layout.deltaEnd
export const selectPersonalId = (state: RootState) => state.layout.personalId
export const selectFullCardPersonalId = (state: RootState) =>
  state.layout.fullCardPersonalId

// Active
export const selectActiveSections = (state: RootState) =>
  state.layout.activeSections
