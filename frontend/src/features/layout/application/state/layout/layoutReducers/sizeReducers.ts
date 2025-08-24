import type { PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'
import type {
  DraftLayoutState,
  Size,
  // LayoutState,
} from '../../../../domain/model/layoutTypes'

// export const addSizeCard = (
//   state: DraftLayoutState,
//   action: PayloadAction<Partial<Size>>
// ) => {
//   state.sizeCard = { ...state.sizeCard, ...action.payload }
// }

// export const addSizeMiniCard = (
//   state: DraftLayoutState,
//   action: PayloadAction<Partial<Size>>
// ) => {
//   state.sizeMiniCard = { ...state.sizeMiniCard, ...action.payload }
// }

// export const addRemSize = (
//   state: DraftLayoutState,
//   action: PayloadAction<number | null>
// ) => {
//   state.remSize = action.payload
// }

export const sizeReducers = {
  addSizeCard(state: DraftLayoutState, action: PayloadAction<Partial<Size>>) {
    state.sizeCard = { ...state.sizeCard, ...action.payload }
  },
  addSizeMiniCard(
    state: DraftLayoutState,
    action: PayloadAction<Partial<Size>>
  ) {
    state.sizeMiniCard = { ...state.sizeMiniCard, ...action.payload }
  },
  addRemSize(state: DraftLayoutState, action: PayloadAction<number | null>) {
    state.remSize = action.payload
  },
} as const
