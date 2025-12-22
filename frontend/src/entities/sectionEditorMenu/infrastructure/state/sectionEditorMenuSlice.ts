import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CardSection } from '@shared/config/constants'

interface SectionEditorMenuState {
  activeSection: CardSection | null
}

const initialState: SectionEditorMenuState = {
  activeSection: null,
}

export const sectionEditorMenuSlice = createSlice({
  name: 'sectionEditorMenu',
  initialState,
  reducers: {
    setActiveSection(state, action: PayloadAction<CardSection>) {
      if (state.activeSection !== action.payload) {
        state.activeSection = action.payload
      }
    },
    resetActiveSection(state) {
      state.activeSection = null
    },
  },
})

export const { setActiveSection, resetActiveSection } =
  sectionEditorMenuSlice.actions
export default sectionEditorMenuSlice.reducer
