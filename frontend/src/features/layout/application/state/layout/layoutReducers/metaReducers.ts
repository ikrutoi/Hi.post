import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  DraftLayoutState,
  FullCardPersonalId,
} from '../../../../domain/model/layoutTypes'

export const setFullCardPersonalId = (
  state: DraftLayoutState,
  action: PayloadAction<Partial<FullCardPersonalId>>
) => {
  state.fullCardPersonalId = {
    ...state.fullCardPersonalId,
    ...action.payload,
  }
}

export const setFullCard = (
  state: DraftLayoutState,
  action: PayloadAction<boolean>
) => {
  state.fullCard = action.payload
}

export const setAddFullCard = (
  state: DraftLayoutState,
  action: PayloadAction<boolean>
) => {
  state.addFullCard = action.payload
}

export const setSelectedCard = (
  state: DraftLayoutState,
  action: PayloadAction<boolean>
) => {
  state.selectedCard = action.payload
}

export const setMaxCardsList = (
  state: DraftLayoutState,
  action: PayloadAction<number | null>
) => {
  state.maxCardsList = action.payload
}

export const setSliderLetter = (
  state: DraftLayoutState,
  action: PayloadAction<string | null>
) => {
  state.sliderLetter = action.payload
}

export const setSliderLine = (
  state: DraftLayoutState,
  action: PayloadAction<string | null>
) => {
  state.sliderLine = action.payload
}

export const setDeltaEnd = (
  state: DraftLayoutState,
  action: PayloadAction<number | null>
) => {
  state.deltaEnd = action.payload
}

export const setPersonalId = (
  state: DraftLayoutState,
  action: PayloadAction<string | null>
) => {
  state.personalId = action.payload
}

export const setCurrentDate = (
  state: DraftLayoutState,
  action: PayloadAction<string | null>
) => {
  state.currentDate = action.payload
}

export const setCartCards = (
  state: DraftLayoutState,
  action: PayloadAction<any>
) => {
  state.cartCards = action.payload
}

export const setDateCartCards = (
  state: DraftLayoutState,
  action: PayloadAction<any>
) => {
  state.dateCartCards = action.payload
}

export const setLockDateCartCards = (
  state: DraftLayoutState,
  action: PayloadAction<any>
) => {
  state.lockDateCartCards = action.payload
}
