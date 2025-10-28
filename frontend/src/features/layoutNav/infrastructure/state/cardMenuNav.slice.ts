import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CardMenuNav } from '../../domain/types/layoutNav.types'
import type { CardMenuSection } from '@shared/config/constants'

const initialState: CardMenuNav = {
  selectedCardMenuSection: null,
}

export const cardMenuNavSlice = createSlice({
  name: 'cardMenuNav',
  initialState,
  reducers: {
    setSelectedCardMenuSection(state, action: PayloadAction<CardMenuSection>) {
      state.selectedCardMenuSection = action.payload
    },
    clearSelectedCardMenuSection(state) {
      state.selectedCardMenuSection = null
    },
  },
})

export const { setSelectedCardMenuSection, clearSelectedCardMenuSection } =
  cardMenuNavSlice.actions

export default cardMenuNavSlice.reducer
