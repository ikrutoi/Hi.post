import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CardMenuSection } from '@shared/config/constants'

interface CardMenuState {
  activeSection: CardMenuSection | null
}

const initialState: CardMenuState = {
  activeSection: null,
}

export const cardMenuSlice = createSlice({
  name: 'cardMenu',
  initialState,
  reducers: {
    setActiveSection(state, action: PayloadAction<CardMenuSection>) {
      state.activeSection = action.payload
    },
    resetActiveSection(state) {
      state.activeSection = null
    },
  },
})

export const { setActiveSection, resetActiveSection } = cardMenuSlice.actions
export default cardMenuSlice.reducer
