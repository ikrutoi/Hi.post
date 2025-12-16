import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CARDTEXT_KEYS, type CardtextToolbarState } from '@toolbar/domain/types'

const initialState: CardtextToolbarState = Object.fromEntries(
  CARDTEXT_KEYS.map((key) => [key, 'disabled'])
) as CardtextToolbarState

export const cardtextToolbarSlice = createSlice({
  name: 'cardtextToolbar',
  initialState,
  reducers: {
    setCardtextToolbarState(
      state,
      action: PayloadAction<CardtextToolbarState>
    ) {
      return action.payload
    },
    updateCardtextToolbarState(
      state,
      action: PayloadAction<Partial<CardtextToolbarState>>
    ) {
      Object.assign(state, action.payload)
    },
    resetCardtextToolbarState() {
      return initialState
    },
  },
})

export const {
  setCardtextToolbarState,
  updateCardtextToolbarState,
  resetCardtextToolbarState,
} = cardtextToolbarSlice.actions

export default cardtextToolbarSlice.reducer
